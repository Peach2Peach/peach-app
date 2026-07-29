import { NativeModules } from "react-native";
import type { NymProxyEndpoint } from "nym-rn";
import { error } from "../../log/error";
import { info } from "../../log/info";
import { parseError } from "../../parseError";

/**
 * Native module that routes the app's React Native networking (all JS
 * `fetch`/`XMLHttpRequest`, i.e. the Peach API and other HTTP requests) through
 * a local proxy — Android via OkHttp (SOCKS5), iOS via NSURLSession (the local
 * HTTP-CONNECT bridge). Native SDKs with their own transport (e.g. Firebase
 * push) are unaffected. See android/ios SystemProxy.
 */
type SystemProxyNativeModule = {
  /** Route RN networking through the given local proxy. */
  setProxy(
    socks5Host: string,
    socks5Port: number,
    httpHost: string,
    httpPort: number,
  ): void;
  /** Stop routing RN networking through the proxy. */
  clearProxy(): void;
};

const native: SystemProxyNativeModule | undefined = NativeModules.SystemProxy;

/**
 * Route all RN networking through the mixnet using the given local endpoint.
 * No-op (with a warning) if the native module isn't linked, so a missing
 * rebuild degrades to "wallet-only routing" rather than crashing.
 */
export function enableSystemProxy(endpoint: NymProxyEndpoint) {
  if (!native) {
    error("systemProxy - native module not linked; RN traffic not routed");
    return;
  }
  const [httpHost, httpPortStr] = (endpoint.httpProxy ?? "").split(":");
  try {
    native.setProxy(
      endpoint.host,
      endpoint.port,
      httpHost || endpoint.host,
      Number(httpPortStr) || endpoint.port,
    );
    info(
      `systemProxy - RN networking routed via mixnet (socks5 ${endpoint.host}:${endpoint.port}, http ${endpoint.httpProxy})`,
    );
  } catch (e) {
    error("systemProxy - setProxy failed", parseError(e));
  }
}

/** Stop routing RN networking through the mixnet. Safe to call when inactive. */
export function disableSystemProxy() {
  if (!native) return;
  try {
    native.clearProxy();
    info("systemProxy - RN networking back to direct");
  } catch (e) {
    error("systemProxy - clearProxy failed", parseError(e));
  }
}
