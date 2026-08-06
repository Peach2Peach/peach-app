package com.peachbitcoin.peach

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.modules.network.OkHttpClientProvider
import com.facebook.react.modules.websocket.WebSocketModule
import com.peachbitcoin.peach.systemproxy.NymOkHttpClientFactory
import com.peachbitcoin.peach.systemproxy.NymProxyHolder
import com.peachbitcoin.peach.systemproxy.SystemProxyPackage

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Routes RN networking through the mixnet when active (see systemproxy).
          add(SystemProxyPackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    // Install our OkHttp factory before RN networking initializes, so all RN
    // fetch/XHR traffic can be routed through the mixnet when it's active.
    OkHttpClientProvider.setOkHttpClientFactory(NymOkHttpClientFactory())
    // RN WebSockets build their own OkHttpClient (NOT via the factory above), so
    // route them through the mixnet SOCKS proxy too when it's active — reusing the
    // same NymProxyHolder ProxySelector as fetch/XHR. Without this the Peach API
    // WebSocket would connect on the real IP even while the mixnet is on.
    WebSocketModule.setCustomClientBuilder { builder ->
      builder.proxySelector(NymProxyHolder.selector)
    }
    loadReactNative(this)
  }
}
