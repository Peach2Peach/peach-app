package com.rnnotificationbadge;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = RnNotificationBadgeModule.NAME)
public class RnNotificationBadgeModule extends ReactContextBaseJavaModule {
  public static final String NAME = "RnNotificationBadge";

  public RnNotificationBadgeModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  // add empty method to avoid error
  @ReactMethod
  public void setNumber(int number, Promise promise) {
    promise.resolve(null);
  }

  @ReactMethod
  public void getNumber(Promise promise) {
    promise.resolve(0);
  }

  @ReactMethod
  public void increment(Promise promise) {
    promise.resolve(null);
  }
  
}
