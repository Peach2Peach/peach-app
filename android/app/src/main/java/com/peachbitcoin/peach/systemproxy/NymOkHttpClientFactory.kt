package com.peachbitcoin.peach.systemproxy

import com.facebook.react.modules.network.OkHttpClientFactory
import com.facebook.react.modules.network.OkHttpClientProvider
import okhttp3.OkHttpClient

/**
 * OkHttp client factory for RN networking that installs [NymProxyHolder]'s
 * ProxySelector, so all RN `fetch`/`XMLHttpRequest` traffic is routed through
 * the mixnet SOCKS proxy while it is active. Registered in MainApplication.
 */
class NymOkHttpClientFactory : OkHttpClientFactory {
  override fun createNewNetworkModuleClient(): OkHttpClient =
    OkHttpClientProvider.createClientBuilder()
      .proxySelector(NymProxyHolder.selector)
      .build()
}
