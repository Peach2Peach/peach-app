import { NativeModules } from 'react-native'
import { isIOS } from './isIOS'

export const getDeviceLocale = () => {
  if (isIOS()) {
    return NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]
  }
  return NativeModules.I18nManager.localeIdentifier
}
