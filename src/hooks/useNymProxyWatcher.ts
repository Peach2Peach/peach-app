import NymProxy, { NymProxyStatus } from "nym-rn";
import { useEffect, useRef } from "react";
import { useSetToast } from "../components/toast/Toast";
import i18n from "../utils/i18n";
import { rotateExit } from "../utils/wallet/nym/ensureNymProxy";
import { useNymProxyState } from "../utils/wallet/nymProxyStore";
import { peachWallet } from "../utils/wallet/setWallet";

const POLL_INTERVAL_MS = 10_000;

/**
 * While the Nym mixnet is enabled, watch the native client's status. The client
 * can drop on its own (e.g. the exit gateway de-auths the session), in which
 * case the native status flips to `Failed`. On that transition, show a red toast
 * letting the user reconnect (via a different exit) — otherwise the wallet would
 * just silently stop syncing.
 */
export const useNymProxyWatcher = () => {
  const enabled = useNymProxyState((state) => state.enabled);
  const setToast = useSetToast();
  const lastStatus = useRef<NymProxyStatus>(NymProxyStatus.Disconnected);

  useEffect(() => {
    if (!enabled) {
      lastStatus.current = NymProxyStatus.Disconnected;
      return undefined;
    }

    let cancelled = false;
    const tick = async () => {
      let status: NymProxyStatus;
      try {
        status = await NymProxy.status();
      } catch {
        return;
      }
      if (cancelled) return;

      const previous = lastStatus.current;
      lastStatus.current = status;

      // React only on the transition INTO Failed, so the toast isn't re-shown
      // every poll while it stays down.
      if (status === NymProxyStatus.Failed && previous !== NymProxyStatus.Failed) {
        setToast({
          msgKey: "wallet.mixnet.connectionLost",
          color: "red",
          action: {
            label: i18n("retry"),
            iconId: "refreshCw",
            onPress: () => {
              // Prefer a different exit, then rebuild the wallet's connection
              // through it (initWallet -> setBlockchain -> ensureNymProxy).
              rotateExit();
              peachWallet?.initWallet().catch(() => undefined);
            },
          },
        });
      }
    };

    const interval = setInterval(tick, POLL_INTERVAL_MS);
    tick();
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [enabled, setToast]);
};
