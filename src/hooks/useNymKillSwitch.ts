import { waitForHydration } from "../store/waitForHydration";
import { ensureNymProxy } from "../utils/wallet/nym/ensureNymProxy";
import { setNymGate } from "../utils/wallet/nym/nymGate";
import {
  armSystemProxy,
  disableSystemProxy,
} from "../utils/wallet/nym/systemProxy";
import { useNymProxyState } from "../utils/wallet/nymProxyStore";

// Engage exactly once, as early as possible. Module-level so React StrictMode's
// double render (or a remount) can't run it twice.
let engaged = false;

// Safety net: if the persisted mixnet state never hydrates (storage error /
// corrupt JSON — zustand's persist doesn't resolve `onFinishHydration` on the
// error path), lift the blackhole after this long so the app is never left
// permanently offline with no escape hatch. Far longer than a real hydration
// (which is a single MMKV read), so it only ever fires on an actual failure.
const HYDRATION_SAFETY_MS = 10_000;

/**
 * Fail-closed mixnet ("VPN") kill switch, engaged at startup.
 *
 * Runs in App's render — before the child screens mount and fire their fetches,
 * and before the WebSocket opens. It arms the native proxy at a dead-port
 * blackhole **by default**, because the persisted mixnet state hydrates
 * asynchronously and isn't known yet: fail-closed until proven safe. So nothing
 * can leak out on the real connection in the meantime. Once hydration finishes:
 *   - enabled  → connect Nym; the gate opens to `routed` when it's up.
 *   - disabled → lift the blackhole and open the gate to `off` (direct).
 *
 * Never bricks the app: the UI renders on local hydration (no network), so
 * settings and the persistent "Nym failed" toast (one-tap disable) are always
 * reachable — disabling clears the blackhole and restores a direct connection.
 */
export const useNymKillSwitch = () => {
  if (engaged) return;
  engaged = true;

  // Fail-closed immediately, before we know whether the mixnet is on.
  armSystemProxy();
  setNymGate("armed");

  let decided = false;
  const decide = () => {
    if (decided) return;
    decided = true;
    if (useNymProxyState.getState().enabled) {
      // Connect; ensureNymProxy re-arms, then routes and opens the gate.
      ensureNymProxy().catch(() => undefined);
    } else {
      // Mixnet is off — lift the blackhole, let traffic go direct.
      disableSystemProxy();
      setNymGate("off");
    }
  };

  waitForHydration(useNymProxyState).then(decide);
  // Never leave the app permanently blackholed if hydration never resolves.
  setTimeout(decide, HYDRATION_SAFETY_MS);
};
