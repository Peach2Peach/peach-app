import { Dispatch, useEffect } from "react";
import { useSetToast } from "../components/toast/Toast";
import { useAccountStore } from "../utils/account/account";
import { info } from "../utils/log/info";
import { createWebsocket } from "../utils/peachAPI/websocket/createWebsocket";

const RETRY_INTERVAL = 3000;
const INIT_RETRY_INTERVAL = 10000;

const initWebSocket =
  (updatePeachWS: React.Dispatch<PeachWS>, setToast: Dispatch<ToastState>) =>
  () => {
    const publicKey = useAccountStore.getState().account.publicKey;
    if (!publicKey) {
      setTimeout(() => {
        initWebSocket(updatePeachWS, setToast)();
      }, INIT_RETRY_INTERVAL);
      return () => null;
    }

    const ws = createWebsocket();

    updatePeachWS(ws);

    const onMessageHandler = (message: unknown) => {
      info("MESSAGE", JSON.stringify(message));
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
        initWebSocket(updatePeachWS, setToast)();
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
      !ws.listeners.message.some(
        (cllbck) => cllbck.toString() === onCloseHandler.toString(),
      )
    ) {
      ws.on("close", onCloseHandler);
    }

    return () => {
      ws.listeners = { message: [], close: [] };
      ws.close();
    };
  };

export const useWebSocket = (updatePeachWS: React.Dispatch<PeachWS>) => {
  const setToast = useSetToast();
  const publicKey = useAccountStore((state) => state.account.publicKey);
  useEffect(() => {
    if (!publicKey) {
      setTimeout(() => {
        initWebSocket(updatePeachWS, setToast)();
      }, INIT_RETRY_INTERVAL);
      return () => null;
    }

    const ws = createWebsocket();

    updatePeachWS(ws);

    const onMessageHandler = (message: unknown) => {
      info("MESSAGE", JSON.stringify(message));
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
        initWebSocket(updatePeachWS, setToast)();
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
      !ws.listeners.message.some(
        (cllbck) => cllbck.toString() === onCloseHandler.toString(),
      )
    ) {
      ws.on("close", onCloseHandler);
    }

    return () => {
      ws.listeners = { message: [], close: [] };
      ws.close();
    };
  }, [updatePeachWS, setToast, publicKey]);
};
