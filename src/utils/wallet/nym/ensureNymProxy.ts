/* eslint-disable no-await-in-loop -- the loops here drive a SERIAL native-client
   protocol (poll-until-disconnected; connect→verify→retry): each step must
   observe the previous one before the next runs, so awaiting in sequence is
   correct, not a missed parallelization. */
/* eslint-disable require-atomic-updates -- the module-level connection singletons
   (cachedEndpoint / activeConfigKey / startInProgress) are serialized by the
   startInProgress mutex: only one connect runs at a time and concurrent callers
   await the same promise, so these reassignments across awaits are not races. */
import { DocumentDirectoryPath, exists, mkdir } from "@dr.pogodin/react-native-fs";
import { API_URL } from "@env";
import NymProxy, { NymProxyStatus, type NymProxyEndpoint } from "nym-rn";
import { error } from "../../log/error";
import { info } from "../../log/info";
import { parseError } from "../../parseError";
import { useNymProxyState } from "../nymProxyStore";
import { DEFAULT_EXIT_COUNTRIES } from "./exitCountries";
import {
  clearNymConnectingToast,
  showNymConnectingToast,
  showNymFailedToast,
} from "./nymToast";
import { setNymGate } from "./nymGate";
import {
  armSystemProxy,
  disableSystemProxy,
  enableSystemProxy,
} from "./systemProxy";

const NYM_STORAGE_DIR = `${DocumentDirectoryPath}/nym`;

// Hard ceiling for a single connect attempt. The mixnet's first bootstrap
// (fetch topology, gateway handshake, resolve exit) legitimately takes ~20-30s,
// so this must be generous enough not to kill a slow-but-valid connect — but
// bounded so a dead gateway (which the SDK would otherwise retry forever) fails
// cleanly instead of stalling the wallet silently in "Connecting".
const NYM_CONNECT_TIMEOUT_MS = 30_000;

// "Connected" from the SDK only means it bound the local SOCKS5 listener — it has
// NOT verified the chosen exit is usable. The exit selector picks a network
// requester from the Nym directory whose gateway may not be in the client's
// routing topology; then every packet is silently dropped ("no node with identity
// X is known") while the status stays pinned at Connected. So after each connect
// we probe a real request through the exit. A dead exit fails the probe and we
// reconnect — a fresh start re-resolves a DIFFERENT exit within the same allowed
// countries — until one actually routes (or we give up and stay fail-closed).
//
// A large fraction of the directory's exits are advertised but not actually
// routable (their gateway isn't in the client's routing topology), so budget
// generously: each dead attempt costs ~one probe timeout, but exhausting the
// budget drops the user to the "Nym failed" toast, which is far worse than
// waiting a few extra seconds for a live exit.
const MAX_CONNECT_ATTEMPTS = 6;
const PROBE_TIMEOUT_MS = 8_000;

// A connect can also fail by THROWING rather than by yielding a dead exit, and
// those failures are often transient infrastructure rather than a bad exit. The
// one that bites in practice is TLS: on Android the certificate verifier checks
// revocation, which for Let's Encrypt certs (the Nym API among them) means
// fetching a CRL over HTTP. Right after a fresh install — device busy with
// dexopt, cold DNS — that fetch can fail, and the whole handshake is reported as
// "invalid peer certificate: Revoked". Retrying a few seconds later succeeds.
//
// Unlike a dead exit, re-selecting instantly doesn't help here: the next attempt
// would land in the same bad window. So back off between attempts, growing a
// little each time and capped so six attempts stay within a sane wait.
const START_RETRY_BACKOFF_MS = 1_500;
const MAX_START_RETRY_BACKOFF_MS = 5_000;

let cachedEndpoint: NymProxyEndpoint | undefined;
let startInProgress: Promise<NymProxyEndpoint | undefined> | undefined;
// The store config (countries + serviceProvider) the live connection was started
// with. If it changes, the cached endpoint is stale and we must reconnect so the
// new exit selection actually takes effect.
let activeConfigKey: string | undefined;

const configKey = (countries: string[], serviceProvider: string) =>
  JSON.stringify([[...countries].sort(), serviceProvider.trim()]);

/** The endpoint of the currently-connected client (socks5 url + local
 *  HTTP-CONNECT bridge host:port), or undefined when not connected. Exposed for
 *  on-device diagnostics (e.g. showing whether the bridge port is set). */
export const getNymEndpoint = (): NymProxyEndpoint | undefined => cachedEndpoint;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Wait before the next attempt; no wait after the last one, which just fails. */
const backoffBeforeRetry = (attempt: number) =>
  sleep(
    attempt < MAX_CONNECT_ATTEMPTS
      ? Math.min(START_RETRY_BACKOFF_MS * attempt, MAX_START_RETRY_BACKOFF_MS)
      : 0,
  );

/**
 * `NymProxy.start` races a timeout: the native SDK retries an unreachable
 * gateway indefinitely, so without this a dead mixnet would hang the connect
 * forever (status stuck in Connecting, no failure ever surfaced). On timeout we
 * reject; the caller's catch tears the native client down and surfaces it.
 */
async function startWithTimeout(config: Parameters<typeof NymProxy.start>[0]) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(
      () =>
        reject(
          new Error(
            `connection timed out after ${NYM_CONNECT_TIMEOUT_MS / 1000}s`,
          ),
        ),
      NYM_CONNECT_TIMEOUT_MS,
    );
  });
  try {
    return await Promise.race([NymProxy.start(config), timeout]);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * One connect attempt, reported as a value instead of a throw, so the retry loop
 * can treat a thrown attempt exactly like one that produced a dead exit. Lives
 * outside the loop so it closes over nothing mutable.
 */
async function attemptStart(
  config: Parameters<typeof NymProxy.start>[0],
): Promise<{ endpoint?: NymProxyEndpoint; error?: string }> {
  try {
    return { endpoint: await startWithTimeout(config) };
  } catch (e) {
    return { error: parseError(e) };
  }
}

/**
 * Verify the mixnet actually carries data end-to-end — not just that the SDK
 * reported "Connected". Must be called AFTER enableSystemProxy so the request
 * rides the mixnet exit (the HTTP-CONNECT bridge), not the blackhole. ANY HTTP
 * reply (even a 4xx/5xx) proves the request reached the Peach API through the
 * exit; a dead/unroutable exit produces no reply at all (timeout/abort) → false,
 * which tells the caller to reconnect to a different exit. Never throws.
 */
async function probeMixnetDataPath(): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    await fetch(`${API_URL}/v1/system/status`, { signal: controller.signal });
    return true;
  } catch (e) {
    info(`ensureNymProxy - data-path probe failed: ${parseError(e)}`);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Point RN networking at a freshly connected exit and confirm it actually
 * carries data. Returns the endpoint when the route is proven, else undefined.
 *
 * Enabling the proxy before the probe is required (the probe must ride the
 * mixnet, not the blackhole) and safe even if this exit turns out to be dead: a
 * bad exit drops packets inside the mixnet, it never leaks a direct connection.
 * The gate stays `armed` until the caller sees a proven route.
 */
async function routeAndVerify(endpoint: NymProxyEndpoint) {
  enableSystemProxy(endpoint);
  return (await probeMixnetDataPath()) ? endpoint : undefined;
}

/**
 * Tear down the native client and wait until it actually reports Disconnected.
 * The native module is a singleton that outlives JS reloads, so its status is
 * the source of truth — not our in-JS `cachedEndpoint`. `stop()` only signals
 * shutdown; the client disconnects asynchronously, so poll until it settles.
 */
async function stopAndWaitDisconnected() {
  await NymProxy.stop().catch((e) => error("ensureNymProxy - stop", parseError(e)));
  for (let i = 0; i < 40; i++) {
    try {
      if ((await NymProxy.status()) === NymProxyStatus.Disconnected) return;
    } catch (e) {
      error("ensureNymProxy - status during stop", parseError(e));
      return;
    }
    await sleep(250);
  }
  error("ensureNymProxy - client did not reach Disconnected after stop");
}

/**
 * Force the native client down regardless of store state. Used when the active
 * node can't use the mixnet (non-Esplora), so a previously running client is
 * torn down rather than left connected.
 */
export async function stopNymProxy() {
  if ((await NymProxy.status()) !== NymProxyStatus.Disconnected) {
    await stopAndWaitDisconnected();
  }
  disableSystemProxy();
  cachedEndpoint = undefined;
}

/**
 * Reconcile the running Nym SOCKS5 client with the current store state and
 * return the local SOCKS5 endpoint to route wallet traffic through.
 *
 * The exit is chosen by the native SDK from, in priority order: the allowed
 * `countries` list, else a specific `serviceProvider`, else any performant exit.
 * A fresh connect re-resolves the exit, so recovering from a drop (see
 * useNymProxyWatcher) automatically fails over to another exit.
 *
 * Reconciles against the NATIVE status (which survives JS reloads), so it
 * recovers from a stale client left behind by a fast-refresh, an interrupted
 * apply, or an exit that dropped on its own.
 */
export async function ensureNymProxy({
  // The manual "apply mixnet settings" flow shows its own popup, so it opts out
  // of the connecting/failure toasts. The background/startup path leaves them on
  // so a slow or dead connect is announced (and offers a one-tap disable).
  silent = false,
}: { silent?: boolean } = {}): Promise<NymProxyEndpoint | undefined> {
  const { enabled, countries, serviceProvider } = useNymProxyState.getState();

  if (!enabled) {
    if (cachedEndpoint || (await NymProxy.status()) !== NymProxyStatus.Disconnected) {
      info("ensureNymProxy - disabling, stopping client");
      await stopAndWaitDisconnected();
    }
    disableSystemProxy();
    setNymGate("off");
    cachedEndpoint = undefined;
    return undefined;
  }

  if (startInProgress) return startInProgress;

  if (cachedEndpoint) {
    const currentKey = configKey(countries, serviceProvider);
    try {
      // Reuse the live connection only if it's up AND was started with the same
      // country/exit selection; otherwise fall through to reconnect below.
      if (
        currentKey === activeConfigKey &&
        (await NymProxy.status()) === NymProxyStatus.Connected
      ) {
        setNymGate("routed");
        return cachedEndpoint;
      }
    } catch (e) {
      error("ensureNymProxy - status check failed", parseError(e));
    }
    cachedEndpoint = undefined;
  }

  startInProgress = (async () => {
    try {
      // Engage the fail-closed kill switch the instant we commit to connecting:
      // block ALL traffic (blackhole) so nothing leaks direct while Nym connects.
      // Stays armed if the connect fails (the failed toast's one-tap disable is
      // the escape hatch); only a VERIFIED route or a disable lifts it.
      armSystemProxy();
      setNymGate("armed");

      if (!(await exists(NYM_STORAGE_DIR))) {
        await mkdir(NYM_STORAGE_DIR, { NSURLIsExcludedFromBackupKey: true });
      }

      // Enforce the country block: never pass an empty list when no specific
      // exit is pinned — an empty list lets the SDK pick ANY country, including
      // blocked ones. Fall back to a BUNDLED default set (European exits); it must
      // be bundled, not fetched, so the fail-closed kill switch above can't block
      // the connect on a country lookup. A pinned serviceProvider overrides.
      let allowedCountries = countries;
      if (!allowedCountries.length && !serviceProvider.trim()) {
        allowedCountries = DEFAULT_EXIT_COUNTRIES;
      }

      if (!silent) showNymConnectingToast();

      // Connect, then verify the exit actually routes. If it doesn't, reconnect:
      // a fresh start re-resolves a DIFFERENT exit within the same allowed
      // countries (we never re-pin the dead one), so a handful of attempts finds
      // a routable exit — exactly what a manual disable/enable does by hand.
      //
      // An attempt can also fail by throwing (transient TLS/network), which is
      // retried the same way; see attemptStart and backoffBeforeRetry.

      // Kept so the final failure reports the REAL cause (e.g. the TLS error)
      // rather than a generic "no routable exit", which the UI shows verbatim.
      let lastStartError: string | undefined;

      for (let attempt = 1; attempt <= MAX_CONNECT_ATTEMPTS; attempt++) {
        // Reset any client left behind — a stale one from a JS reload, or the
        // dead-exit client from the previous attempt — so start() connects fresh.
        if ((await NymProxy.status()) !== NymProxyStatus.Disconnected) {
          info("ensureNymProxy - resetting native client before start");
          await stopAndWaitDisconnected();
        }

        info(
          `ensureNymProxy - connecting attempt ${attempt}/${MAX_CONNECT_ATTEMPTS} (${
            serviceProvider.trim()
              ? "custom exit"
              : `countries=${allowedCountries.length}`
          })`,
        );
        // A throw is a failed ATTEMPT, not a failed connect: recorded as a value
        // so the loop retries it. Without this a single transient TLS/network
        // failure aborted the whole connect on the first try, leaving the retry
        // budget below entirely unused.
        const started = await attemptStart({
          countries: allowedCountries.length ? allowedCountries : undefined,
          serviceProvider: serviceProvider.trim() || undefined,
          storageDir: NYM_STORAGE_DIR,
          httpProxy: true,
        });

        if (started.error) {
          lastStartError = started.error;
          error(
            `ensureNymProxy - connect attempt ${attempt}/${MAX_CONNECT_ATTEMPTS} failed`,
            started.error,
          );
        }

        // The connect can take ~30s; if the user disabled the mixnet meanwhile,
        // honor that — tear this fresh client down and go direct rather than
        // routing through it (a concurrent !enabled reconcile may have raced us).
        if (!useNymProxyState.getState().enabled) {
          info("ensureNymProxy - disabled mid-connect; going direct");
          NymProxy.stop().catch(() => undefined);
          disableSystemProxy();
          setNymGate("off");
          if (!silent) clearNymConnectingToast();
          return undefined;
        }

        // Attempt threw: wait before retrying so the next one doesn't land in
        // the same bad window. Still fail-closed (the kill switch armed before
        // the loop was never lifted), so waiting here leaks nothing.
        if (!started.endpoint) {
          await backoffBeforeRetry(attempt);
        }

        // Set only once the probe proves this exit actually carries data, so it
        // doubles as the "this attempt succeeded" flag.
        const routedEndpoint = started.endpoint
          ? await routeAndVerify(started.endpoint)
          : undefined;

        if (routedEndpoint) {
          info(
            `ensureNymProxy - connected + route verified (attempt ${attempt}), socks5 at ${routedEndpoint.url}`,
          );
          cachedEndpoint = routedEndpoint;
          activeConfigKey = configKey(countries, serviceProvider);
          if (!silent) clearNymConnectingToast();
          // Open the gate so the WebSocket connects (through the mixnet now).
          setNymGate("routed");
          return routedEndpoint;
        }

        // Unroutable exit: back to fail-closed, then loop to re-select a
        // different exit (the loop-top teardown + a fresh start re-resolves).
        if (started.endpoint) {
          info(
            `ensureNymProxy - exit did not route (attempt ${attempt}); re-selecting`,
          );
          armSystemProxy();
          setNymGate("armed");
        }
      }

      throw new Error(
        lastStartError
          ? `connect failed after ${MAX_CONNECT_ATTEMPTS} attempts: ${lastStartError}`
          : `no routable exit found after ${MAX_CONNECT_ATTEMPTS} attempts`,
      );
    } catch (e) {
      const reason = parseError(e);
      error("ensureNymProxy - start failed", reason);
      cachedEndpoint = undefined;
      // Tear down whatever the (possibly hung) start left behind so the native
      // status settles to Disconnected rather than lingering in Connecting.
      NymProxy.stop().catch(() => undefined);
      if (!silent) showNymFailedToast();
      // Surface the real cause so it can be shown on screen. The wallet must not
      // silently fall back to a direct (deanonymized) connection.
      throw new Error(`Nym proxy failed: ${reason}`);
    } finally {
      startInProgress = undefined;
    }
  })();

  return startInProgress;
}
