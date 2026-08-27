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
      // Register so the holder can drop this client's pooled connections when
      // routing changes. RN's NetworkingModule builds its client with
      // OkHttpClientProvider.createClient(), NOT the getOkHttpClient() singleton,
      // so the holder cannot find it any other way — and without evicting THIS
      // pool, enabling the mixnet at runtime leaves existing keep-alive
      // connections going direct.
      .also { NymProxyHolder.registerClient(it) }
}
