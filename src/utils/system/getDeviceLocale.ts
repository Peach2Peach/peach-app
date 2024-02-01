import { NativeModules } from "react-native";
import { isIOS } from "./isIOS";

export const getDeviceLocale = () => {
  if (isIOS()) {
    return NativeModules.SettingsManager.settings.AppleLocale;
  }
  return NativeModules.I18nManager.localeIdentifier;
};
