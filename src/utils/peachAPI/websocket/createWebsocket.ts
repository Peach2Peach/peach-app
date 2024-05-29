import { API_URL } from "@env";
import { crypto } from "bitcoinjs-lib";
import { info } from "../../../utils/log/info";
import { dateTimeReviver } from "../../system/dateTimeReviver";
import { getAuthenticationChallenge } from "../getAuthenticationChallenge";
import { peachAPI } from "../peachAPI";
import { peachWS, setPeachWS, setWS, ws } from "./index";

export const createWebsocket = (oldPeachWS?: PeachWS): PeachWS => {
  if (ws) {
    ws.removeEventListener("open", onOpenHandler);
    ws.removeEventListener("message", onMessageHandler);
    ws.removeEventListener("close", onCloseHandler);
  }

  setWS(new WebSocket(`${API_URL.replace("http", "ws")}/`));
  setPeachWS(undefined, {
    ...peachWS,
    ws,
    authenticated: false,
    connected: false,
    queue: oldPeachWS?.queue || [],
    listeners: oldPeachWS?.listeners || {
      message: [],
      close: [],
    },
    close: () => {
      ws.removeEventListener("message", onMessageHandler);
      ws.close();
    },
  });

  peachWS.send = (data: string) => {
    if (!peachWS.connected) {
      info("Peach WS API - reestablishing connection.");

      peachWS.queue.push(() => peachWS.send(data));
      ws.close();
      setPeachWS(undefined, createWebsocket(peachWS));

      return false;
    }

    ws.send(data);
    return true;
  };

  ws.addEventListener("open", onOpenHandler);
  ws.addEventListener("message", onMessageHandler);
  ws.addEventListener("close", onCloseHandler);
  return peachWS;
};

function onCloseHandler() {
  info("Peach WS API - connection closed.");
  peachWS.connected = false;
  peachWS.listeners.close.forEach((listener) => listener());
  peachWS.listeners.close = [];
  ws.removeEventListener("message", onMessageHandler);
}

function onOpenHandler() {
  peachWS.connected = true;
  authWS(ws);

  // if a queue built up while offline, now send what has queued up
  peachWS.queue = peachWS.queue.filter((callback) => !callback());
}

function onMessageHandler(msg: WebSocketMessageEvent) {
  const message = JSON.parse(msg.data, dateTimeReviver);

  if (!peachWS.authenticated && message.accessToken) {
    info("Peach WS API - authenticated");
    peachWS.authenticated = true;
    return;
  }
  if (!peachWS.authenticated) return;

  peachWS.listeners.message.forEach((listener) => listener(message));
}

function authWS(websocket: WebSocket) {
  const peachAccount = peachAPI.apiOptions.peachAccount;
  const message = getAuthenticationChallenge();

  if (!peachAccount) return;

  websocket.send(
    JSON.stringify({
      path: "/v1/user/auth",
      publicKey: peachAccount.publicKey.toString("hex"),
      message,
      signature: peachAccount
        .sign(crypto.sha256(Buffer.from(message)))
        .toString("hex"),
    }),
  );
}
