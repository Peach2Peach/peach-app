package com.peachbitcoin.peach.systemproxy

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Routes RN networking through the mixnet. Android uses the SOCKS5 endpoint
 * (OkHttp supports SOCKS5 well); the http args are ignored here (they are for
 * iOS, which routes via the HTTP-CONNECT bridge instead).
 */
class SystemProxyModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "SystemProxy"

  @ReactMethod
  fun setProxy(
    socks5Host: String,
    socks5Port: Double,
    httpHost: String,
    httpPort: Double,
  ) {
    NymProxyHolder.setSocks(socks5Host, socks5Port.toInt())
  }

  @ReactMethod
  fun clearProxy() {
    NymProxyHolder.clear()
  }

  /** Fail-closed kill switch: block all routed traffic until the mixnet is up. */
  @ReactMethod
  fun armKillSwitch() {
    NymProxyHolder.setBlackhole()
  }
}
