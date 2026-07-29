package com.peachbitcoin.peach

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.modules.network.OkHttpClientProvider
import com.peachbitcoin.peach.systemproxy.NymOkHttpClientFactory
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
    loadReactNative(this)
  }
}
