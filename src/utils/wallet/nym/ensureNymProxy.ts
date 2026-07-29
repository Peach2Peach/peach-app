import { DocumentDirectoryPath, exists, mkdir } from "@dr.pogodin/react-native-fs";
import NymProxy, { NymProxyStatus, type NymProxyEndpoint } from "nym-rn";
import { error } from "../../log/error";
import { info } from "../../log/info";
import { parseError } from "../../parseError";
import { useNymProxyState } from "../nymProxyStore";
import { getAllowedExitCountries } from "./exitCountries";
import {
  clearNymConnectingToast,
  showNymConnectingToast,
  showNymFailedToast,
} from "./nymToast";
import { disableSystemProxy, enableSystemProxy } from "./systemProxy";

const NYM_STORAGE_DIR = `${DocumentDirectoryPath}/nym`;

// Hard ceiling for a single connect attempt. The mixnet's first bootstrap
// (fetch topology, gateway handshake, resolve exit) legitimately takes ~20-30s,
// so this must be generous enough not to kill a slow-but-valid connect — but
// bounded so a dead gateway (which the SDK would otherwise retry forever) fails
// cleanly instead of stalling the wallet silently in "Connecting".
const NYM_CONNECT_TIMEOUT_MS = 30_000;

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
        return cachedEndpoint;
      }
    } catch (e) {
      error("ensureNymProxy - status check failed", parseError(e));
    }
    cachedEndpoint = undefined;
  }

  startInProgress = (async () => {
    try {
      // Reset any stale/failed native client before connecting fresh.
      if ((await NymProxy.status()) !== NymProxyStatus.Disconnected) {
        info("ensureNymProxy - resetting stale native client before start");
        await stopAndWaitDisconnected();
      }

      if (!(await exists(NYM_STORAGE_DIR))) {
        await mkdir(NYM_STORAGE_DIR, { NSURLIsExcludedFromBackupKey: true });
      }

      // Enforce the country block: never pass an empty list when no specific
      // exit is pinned — an empty list lets the SDK pick ANY country, including
      // blocked ones. Fall back to the full allowed set (Nym-supported minus
      // BLOCKED_COUNTRIES). A pinned serviceProvider is an explicit override.
      let allowedCountries = countries;
      if (!allowedCountries.length && !serviceProvider.trim()) {
        allowedCountries = await getAllowedExitCountries();
      }

      info(
        `ensureNymProxy - connecting (${
          serviceProvider.trim()
            ? "custom exit"
            : `countries=${allowedCountries.length}`
        })`,
      );
      if (!silent) showNymConnectingToast();
      const endpoint = await startWithTimeout({
        countries: allowedCountries.length ? allowedCountries : undefined,
        serviceProvider: serviceProvider.trim() || undefined,
        storageDir: NYM_STORAGE_DIR,
        httpProxy: true,
      });
      info(`ensureNymProxy - connected, socks5 at ${endpoint.url}`);
      cachedEndpoint = endpoint;
      activeConfigKey = configKey(countries, serviceProvider);
      if (!silent) clearNymConnectingToast();
      // Route the app's RN networking (Peach API + other fetch) through it too.
      enableSystemProxy(endpoint);
      return endpoint;
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
