import { Dispatch, useEffect } from "react";
import { useSetToast } from "../components/toast/Toast";
import { useAccountStore } from "../utils/account/account";
import { info } from "../utils/log/info";
import { createWebsocket } from "../utils/peachAPI/websocket/createWebsocket";
import { whenNetworkReady } from "../utils/wallet/nym/nymGate";

const RETRY_INTERVAL = 3000;
const INIT_RETRY_INTERVAL = 10000;

type ConnectState = { cancelled: boolean; ws?: PeachWS };

/**
 * Open the Peach API WebSocket, wire its handlers, and reconnect on close.
 *
 * Waits on the Nym gate before opening: while the mixnet ("VPN") is enabled but
 * not yet connected, the gate holds, so the socket never opens on the real
 * connection (fail-closed — no real-IP leak). It opens once Nym is routed
 * (through the mixnet) or disabled (direct). `state` lets the owning effect
 * cancel a pending/queued open and close the live socket on cleanup.
 */
const openWebSocket = (
  updatePeachWS: React.Dispatch<PeachWS>,
  setToast: Dispatch<ToastState>,
  state: ConnectState,
) => {
  const publicKey = useAccountStore.getState().account.publicKey;
  if (!publicKey) {
    setTimeout(() => {
      if (!state.cancelled) openWebSocket(updatePeachWS, setToast, state);
    }, INIT_RETRY_INTERVAL);
    return;
  }

  whenNetworkReady().then(() => {
    if (state.cancelled) return;

    const ws = createWebsocket();
    state.ws = ws;
    updatePeachWS(ws);

    const onMessageHandler = (message: unknown) => {
      if (
        message &&
        typeof message === "object" &&
        "error" in message &&
        typeof message.error === "string"
      ) {
        setToast({
          msgKey: message.error,
          color: "red",
        });
      }
    };

    const onCloseHandler = () => {
      info("CLOSE");
      setTimeout(() => {
        if (!state.cancelled) openWebSocket(updatePeachWS, setToast, state);
      }, RETRY_INTERVAL);
    };

    if (
      !ws.listeners.message.some(
        (cllbck) => cllbck.toString() === onMessageHandler.toString(),
      )
    ) {
      ws.on("message", onMessageHandler);
    }
    if (
      !ws.listeners.close.some(
        (cllbck) => cllbck.toString() === onCloseHandler.toString(),
      )
    ) {
      ws.on("close", onCloseHandler);
    }
  });
};

export const useWebSocket = (updatePeachWS: React.Dispatch<PeachWS>) => {
  const setToast = useSetToast();
  const publicKey = useAccountStore((state) => state.account.publicKey);
  useEffect(() => {
    const state: ConnectState = { cancelled: false };
    openWebSocket(updatePeachWS, setToast, state);
    return () => {
      state.cancelled = true;
      if (state.ws) {
        state.ws.listeners = { message: [], close: [] };
        state.ws.close();
      }
    };
  }, [updatePeachWS, setToast, publicKey]);
};
