import NetInfo from "@react-native-community/netinfo";
import NymProxy, { NymProxyStatus } from "nym-rn";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useSetToast } from "../components/toast/Toast";
import i18n from "../utils/i18n";
import { error } from "../utils/log/error";
import { info } from "../utils/log/info";
import { parseError } from "../utils/parseError";
import { ensureNymProxy } from "../utils/wallet/nym/ensureNymProxy";
import { useNymProxyState } from "../utils/wallet/nymProxyStore";
import { peachWallet } from "../utils/wallet/setWallet";

const POLL_INTERVAL_MS = 10_000;

/**
 * While the Nym mixnet is enabled, watch the native client's status. The client
 * can drop on its own (exit gateway de-auth, the network going away under a live
 * tunnel), in which case the native status flips to `Failed` and the wallet would
 * otherwise just silently stop syncing.
 *
 * On the transition into `Failed` we try ONE silent reconnect and only bother the
 * user with the red toast if that fails. A fresh connect re-resolves the exit, so
 * the retry naturally fails over to a different one.
 *
 * The 10s poll is the floor, not the only trigger: coming back to the foreground
 * or regaining connectivity checks immediately, since both are exactly when the
 * client is most likely to have died while we weren't looking.
 */
export const useNymProxyWatcher = () => {
  const enabled = useNymProxyState((state) => state.enabled);
  const setToast = useSetToast();
  const lastStatus = useRef<NymProxyStatus>(NymProxyStatus.Disconnected);
  // One silent reconnect per outage. Reset once we see a healthy client again,
  // so a later, unrelated drop still gets its own attempt.
  const recoveryAttempted = useRef(false);
  const recovering = useRef(false);

  useEffect(() => {
    if (!enabled) {
      lastStatus.current = NymProxyStatus.Disconnected;
      recoveryAttempted.current = false;
      return undefined;
    }

    let cancelled = false;

    const showConnectionLostToast = () =>
      setToast({
        msgKey: "wallet.mixnet.connectionLost",
        color: "red",
        action: {
          label: i18n("retry"),
          iconId: "refreshCw",
          onPress: () => {
            // Rebuild the wallet's connection; the native SDK re-resolves the
            // exit on reconnect, so this fails over to another exit.
            peachWallet?.initWallet().catch(() => undefined);
          },
        },
      });

    const recover = async () => {
      recovering.current = true;
      try {
        info("useNymProxyWatcher - client dropped, reconnecting silently");
        // Resolves only once a route is VERIFIED through the mixnet, and throws
        // if every attempt fails. Keeps the fail-closed kill switch armed
        // throughout, so nothing leaks direct while we reconnect.
        const endpoint = await ensureNymProxy({ silent: true });
        // The user turned the mixnet off mid-reconnect — not a failure.
        if (!endpoint || cancelled) return;
        // Rebuild the blockchain client on top of the new endpoint; the old one
        // still points at the dead SOCKS port.
        await peachWallet?.initWallet();
        info("useNymProxyWatcher - reconnected");
      } catch (e) {
        error("useNymProxyWatcher - silent reconnect failed", parseError(e));
        if (!cancelled) showConnectionLostToast();
      } finally {
        recovering.current = false;
      }
    };

    const checkNow = async () => {
      let status: NymProxyStatus;
      try {
        status = await NymProxy.status();
      } catch {
        return;
      }
      if (cancelled) return;

      const previous = lastStatus.current;
      lastStatus.current = status;

      // A healthy client clears the one-shot budget so the NEXT outage can also
      // recover on its own.
      if (status === NymProxyStatus.Connected) {
        recoveryAttempted.current = false;
        return;
      }

      // React only on the transition INTO Failed, so we don't re-fire every poll
      // while it stays down.
      if (status !== NymProxyStatus.Failed || previous === NymProxyStatus.Failed) {
        return;
      }
      // Everything from here to setting the flag must stay synchronous, or two
      // triggers landing together (poll + foreground, say) both start recovering.
      if (recoveryAttempted.current || recovering.current) return;
      recoveryAttempted.current = true;
      await recover();
    };

    const interval = setInterval(checkNow, POLL_INTERVAL_MS);

    // Coming back from the background: the OS may have suspended or killed the
    // native client while we were away, so don't wait out a poll interval.
    const appStateSubscription = AppState.addEventListener("change", (state) => {
      if (state === "active") checkNow();
    });

    // Same for regaining connectivity — a client that died with the network is
    // exactly the case worth re-checking the moment the network is back.
    let wasReachable: boolean | null = null;
    const unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      const regained = state.isInternetReachable === true && wasReachable === false;
      wasReachable = state.isInternetReachable;
      if (regained) checkNow();
    });

    checkNow();

    return () => {
      cancelled = true;
      clearInterval(interval);
      appStateSubscription.remove();
      unsubscribeNetInfo();
    };
  }, [enabled, setToast]);
};
