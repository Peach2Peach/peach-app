import { getDefaultStore } from "jotai";
import { toastAtom } from "../../../components/toast/Toast";
import i18n from "../../i18n";
import { peachWallet } from "../setWallet";
import { useNymProxyState } from "../nymProxyStore";

const CONNECTING_MSG_KEY = "wallet.mixnet.connecting";
const FAILED_MSG_KEY = "wallet.mixnet.connectFailed";

const store = () => getDefaultStore();

/**
 * Notice shown while the mixnet is connecting on the background/startup path.
 * `keepAlive` so it stays up for the full connect (which can take ~20-30s) and
 * is only removed explicitly (on success, failure, or the hard timeout).
 */
export function showNymConnectingToast() {
  store().set(toastAtom, {
    color: "white",
    msgKey: CONNECTING_MSG_KEY,
    keepAlive: true,
  });
}

/** Remove the connecting notice, but only if it's still the one on screen. */
export function clearNymConnectingToast() {
  if (store().get(toastAtom)?.msgKey === CONNECTING_MSG_KEY) {
    store().set(toastAtom, null);
  }
}

/**
 * Red toast shown when a background/startup mixnet connect fails or times out.
 * Its one action is the escape hatch: disable the mixnet and reconnect the
 * wallet directly to the node — so a broken mixnet is never a dead end even if
 * the user doesn't go hunting through settings.
 */
export function showNymFailedToast() {
  store().set(toastAtom, {
    color: "red",
    // Fail-closed: while the mixnet is armed-but-not-connected the app has no
    // network, so keep this up (it's the one-tap escape hatch) until the user
    // acts on it, rather than letting it auto-dismiss.
    keepAlive: true,
    msgKey: FAILED_MSG_KEY,
    action: {
      label: i18n("wallet.mixnet.disable"),
      iconId: "slash",
      onPress: () => {
        useNymProxyState.getState().setConfig({ enabled: false });
        // Re-init the wallet: ensureNymProxy now sees enabled=false, so it tears
        // the client down, clears the system proxy, and connects directly.
        peachWallet?.initWallet().catch(() => undefined);
      },
    },
  });
}
