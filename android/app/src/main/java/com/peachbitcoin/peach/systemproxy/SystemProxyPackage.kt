package com.peachbitcoin.peach.systemproxy

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class SystemProxyPackage : ReactPackage {
  override fun createNativeModules(
    reactContext: ReactApplicationContext,
  ): List<NativeModule> = listOf(SystemProxyModule(reactContext))

  override fun createViewManagers(
    reactContext: ReactApplicationContext,
  ): List<ViewManager<*, *>> = emptyList()
}
