package com.peachbitcoin.peach.systemproxy

import java.io.IOException
import java.net.InetSocketAddress
import java.net.Proxy
import java.net.ProxySelector
import java.net.SocketAddress
import java.net.URI
import java.util.concurrent.CopyOnWriteArrayList
import okhttp3.OkHttpClient

/**
 * Holds the SOCKS proxy that RN's OkHttp networking should use, if any (set from
 * JS via [SystemProxyModule]). A [ProxySelector] is registered on the OkHttp
 * client — OkHttp consults it per connection, so routing can be toggled at
 * runtime without recreating the client.
 */
object NymProxyHolder {
  private const val TAG = "NymProxyHolder"

  @Volatile private var proxy: Proxy? = null

  // Counts connections actually routed, so logcat shows whether the selector is
  // being consulted at all. The app's own JS logs go to Crashlytics (not logcat)
  // in release builds, so native logging is the only visibility here.
  @Volatile private var selectCount: Long = 0

  // Every OkHttp client the factory hands to RN. Copy-on-write because it is
  // written on client creation and read on every proxy transition, from
  // different threads.
  private val clients = CopyOnWriteArrayList<OkHttpClient>()

  /**
   * Drop every pooled connection so the next request has to open a fresh one and
   * therefore consults the selector again.
   *
   * The ProxySelector is only asked when OkHttp establishes a NEW connection.
   * Keep-alive connections already in the pool are matched by `Address`, which
   * holds this selector *instance* — unchanged across a proxy switch — so they
   * stay reusable and keep carrying traffic over their original route. Without
   * this, enabling the mixnet at runtime left existing connections going direct
   * (an IP check would still report the real country) and it only appeared to
   * work after an app restart, when the pool starts empty and the proxy is set
   * before anything connects.
   *
   * Must run on EVERY transition, including [clear]: connections opened through
   * a SOCKS proxy that is about to be torn down would otherwise be reused
   * against a dead local port.
   *
   * Evicts the clients registered by [NymOkHttpClientFactory], NOT
   * OkHttpClientProvider.getOkHttpClient(). RN's NetworkingModule builds its
   * client with OkHttpClientProvider.createClient(), so the singleton getter
   * returns a DIFFERENT client that `fetch` never uses — evicting that one
   * silently did nothing while looking correct.
   */
  private fun evictPooledConnections() {
    var evicted = 0
    for (client in clients) {
      try {
        // Cancel before evicting: a call in flight holds its connection out of
        // the pool, so evictAll alone would let it return to the pool afterwards
        // and be reused on the old route. Once routing changes, in-flight
        // requests are on the wrong route by definition.
        client.dispatcher.cancelAll()
        client.connectionPool.evictAll()
        evicted++
      } catch (e: Exception) {
        // Never let a networking-internals change break proxy switching: the new
        // proxy still applies to connections opened from now on.
        android.util.Log.w(TAG, "could not evict pooled connections", e)
      }
    }
    android.util.Log.i(TAG, "evicted pools of $evicted client(s)")
  }

  /** Called by [NymOkHttpClientFactory] for every client it hands to RN. */
  fun registerClient(client: OkHttpClient) {
    clients.add(client)
    android.util.Log.i(TAG, "registered OkHttp client (${clients.size} total)")
  }

  fun setSocks(host: String, port: Int) {
    // Unresolved address so OkHttp hands the destination to the SOCKS proxy.
    proxy = Proxy(Proxy.Type.SOCKS, InetSocketAddress.createUnresolved(host, port))
    android.util.Log.i(TAG, "proxy -> SOCKS $host:$port")
    evictPooledConnections()
  }

  fun clear() {
    proxy = null
    android.util.Log.i(TAG, "proxy -> DIRECT (cleared)")
    evictPooledConnections()
  }

  /**
   * Fail-closed "kill switch": route through a dead local port so every
   * connection is refused instead of leaking direct while the mixnet is
   * connecting (or if it never connects). Replaced by [setSocks] once Nym is up.
   */
  fun setBlackhole() {
    proxy = Proxy(Proxy.Type.SOCKS, InetSocketAddress.createUnresolved("127.0.0.1", 1))
    android.util.Log.i(TAG, "proxy -> BLACKHOLE (kill switch armed)")
    // Fail-closed only holds if the pooled direct connections go too — otherwise
    // traffic keeps flowing over them while we believe everything is blocked.
    evictPooledConnections()
  }

  val selector: ProxySelector =
    object : ProxySelector() {
      override fun select(uri: URI?): List<Proxy> {
        val current = proxy
        // Logs which client asked and what it got. If a request that should be
        // routed never appears here, RN's networking is not using this selector
        // (wrong OkHttp client) rather than the proxy being set too late.
        selectCount++
        android.util.Log.i(TAG, "select#$selectCount ${uri?.host} -> ${current ?: "DIRECT"}")
        return listOf(current ?: Proxy.NO_PROXY)
      }

      override fun connectFailed(uri: URI?, sa: SocketAddress?, e: IOException?) {}
    }
}
