package com.peachbitcoin.peach.systemproxy

import java.io.IOException
import java.net.InetSocketAddress
import java.net.Proxy
import java.net.ProxySelector
import java.net.SocketAddress
import java.net.URI

/**
 * Holds the SOCKS proxy that RN's OkHttp networking should use, if any (set from
 * JS via [SystemProxyModule]). A [ProxySelector] is registered on the OkHttp
 * client — OkHttp consults it per connection, so routing can be toggled at
 * runtime without recreating the client.
 */
object NymProxyHolder {
  @Volatile private var proxy: Proxy? = null

  fun setSocks(host: String, port: Int) {
    // Unresolved address so OkHttp hands the destination to the SOCKS proxy.
    proxy = Proxy(Proxy.Type.SOCKS, InetSocketAddress.createUnresolved(host, port))
  }

  fun clear() {
    proxy = null
  }

  val selector: ProxySelector =
    object : ProxySelector() {
      override fun select(uri: URI?): List<Proxy> = listOf(proxy ?: Proxy.NO_PROXY)

      override fun connectFailed(uri: URI?, sa: SocketAddress?, e: IOException?) {}
    }
}
