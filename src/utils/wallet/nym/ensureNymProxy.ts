import { DocumentDirectoryPath, exists, mkdir } from "@dr.pogodin/react-native-fs";
import NymProxy, { NymProxyStatus, type NymProxyEndpoint } from "nym-rn";
import { error } from "../../log/error";
import { info } from "../../log/info";
import { parseError } from "../../parseError";
import { useNymProxyState } from "../nymProxyStore";
import { discoverExitProviders } from "./discoverExitProviders";

const NYM_STORAGE_DIR = `${DocumentDirectoryPath}/nym`;
// How many different exits to try in one connect attempt before giving up.
const MAX_START_ATTEMPTS = 3;

let cachedEndpoint: NymProxyEndpoint | undefined;
let startInProgress: Promise<NymProxyEndpoint | undefined> | undefined;
// Rotating offset into the exit pool so each reconnect prefers a different exit.
let rotationStart = 0;
let currentProvider: string | undefined;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** The exit the client is currently (or was last) routed through. */
export const getCurrentExitProvider = () => currentProvider;

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
 * The exits to try, in preference order:
 * - a user-pinned `serviceProvider` (single, no rotation), or
 * - the auto-discovered public exit pool from the Nym API.
 */
async function resolveCandidates(): Promise<string[]> {
  const custom = useNymProxyState.getState().serviceProvider.trim();
  if (custom) return [custom];
  return discoverExitProviders();
}

/** Advance the rotation so the next connect attempt prefers a different exit. */
export function rotateExit() {
  rotationStart += 1;
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
  cachedEndpoint = undefined;
  currentProvider = undefined;
}

/**
 * Reconcile the running Nym SOCKS5 client with the current store state and
 * return the local SOCKS5 endpoint to route wallet traffic through.
 *
 * - disabled / no candidates -> stops any running client, returns undefined
 * - enabled                  -> connects (trying multiple exits on failure) and
 *                               returns the local endpoint once connected
 *
 * Reconciles against the NATIVE status (which survives JS reloads), so it
 * recovers from a stale client left behind by a fast-refresh, an interrupted
 * apply, or an exit that dropped on its own.
 */
export async function ensureNymProxy(): Promise<NymProxyEndpoint | undefined> {
  const { enabled } = useNymProxyState.getState();

  if (!enabled) {
    if (cachedEndpoint || (await NymProxy.status()) !== NymProxyStatus.Disconnected) {
      info("ensureNymProxy - disabling, stopping client");
      await stopAndWaitDisconnected();
    }
    cachedEndpoint = undefined;
    currentProvider = undefined;
    return undefined;
  }

  if (startInProgress) return startInProgress;

  if (cachedEndpoint) {
    try {
      if ((await NymProxy.status()) === NymProxyStatus.Connected) {
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

      const candidates = await resolveCandidates();
      if (candidates.length === 0) throw new Error("no Nym exit available");

      let lastError = "unknown error";
      const attempts = Math.min(candidates.length, MAX_START_ATTEMPTS);
      for (let k = 0; k < attempts; k++) {
        const provider = candidates[(rotationStart + k) % candidates.length];
        try {
          info(`ensureNymProxy - connecting via exit ${provider}`);
          const endpoint = await NymProxy.start({
            serviceProvider: provider,
            storageDir: NYM_STORAGE_DIR,
          });
          info(`ensureNymProxy - connected, socks5 at ${endpoint.url}`);
          cachedEndpoint = endpoint;
          currentProvider = provider;
          return endpoint;
        } catch (e) {
          lastError = parseError(e);
          error(`ensureNymProxy - exit ${provider} failed`, lastError);
          // Clean up before trying the next exit.
          await stopAndWaitDisconnected();
        }
      }

      cachedEndpoint = undefined;
      // Surface the real cause so it can be shown on screen. The wallet must not
      // silently fall back to a direct (deanonymized) connection.
      throw new Error(`Nym proxy failed: ${lastError}`);
    } finally {
      startInProgress = undefined;
    }
  })();

  return startInProgress;
}
