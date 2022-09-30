import { Linking, Platform } from 'react-native'
import { checkNotifications } from 'react-native-permissions'
import messaging from '@react-native-firebase/messaging'
import { getBundleId, getInstallerPackageNameSync } from 'react-native-device-info'
import { DEV } from '@env'
import { error } from './log'

/**
 * @description Method to check if app is compiled for production
 * @returns true if app is compiled for production
 */
export const isProduction = () => DEV !== 'true'

/**
 * @description Method to check if app is compiled for web
 * @returns true if app is compiled for web
 */
export const isWeb = () => Platform.OS === 'web'

/**
 * @description Method to check if app is compiled for android
 * @returns true if app is compiled for android
 */
export const isAndroid = () => Platform.OS === 'android'

/**
 * @description Method to check if app is compiled for iOS
 * @returns true if app is compiled for iOS
 */
export const isIOS = () => Platform.OS === 'ios'

/**
 * @description Method to check if app is compiled for mobile
 * @returns true if app is compiled for mobile
 */
export const isMobile = () => isAndroid() || isIOS()

/**
 * @description Method to check if app is compatible with minimum version requirement
 * @param version current version number
 * @param minVersion minimum version mumber required
 */
export const compatibilityCheck = (version: string, minVersion: string) => version >= minVersion

/**
 * @description Method to parse errors (e.g. from a try-catch block)
 * @param e error
 * @returns parsed error
 */
export const parseError = (e: Error | string | unknown): string => {
  let err = 'UNKOWN_ERROR'
  if (typeof e === 'string') {
    err = e.toUpperCase()
  } else if (e instanceof Error) {
    err = e.message
  }
  return err
}

/**
 * @description Method to check if app is allowed to receive push notifications
 * @returns true if notifications are enabled
 */
export const checkNotificationStatus = async (): Promise<boolean> => {
  if (isIOS()) {
    try {
      const authStatus = await messaging().hasPermission()
      if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        return true
      }
    } catch (e) {
      error('messaging().hasPermission - Push notifications not supported', parseError(e))
    }

    return false
  }

  const { status } = await checkNotifications()
  if (status === 'granted') {
    return true
  }

  return false
}

/**
 * @description Method to toggle notification status
 * in most cases, user needs to make these settings in the OS settings
 */
export const toggleNotifications = async () => {
  if (isIOS()) {
    const authStatus = await messaging().hasPermission()
    if (authStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
      await messaging().requestPermission({
        alert: true,
        badge: false,
        sound: true
      })
    } else {
      Linking.openURL('app-settings://')
    }
  } else {
    Linking.openSettings()
  }
}

/**
 * @description Method to open app page info in appstore
 */
export const linkToAppStore = () => {
  const bundleId = getBundleId()
  if (isIOS()) {
    Linking.openURL(`itms-apps://itunes.apple.com/us/app/apple-store/${bundleId}?mt=8`)
  } else if (isAndroid()) {
    const isInstalledByGooglePlay = getInstallerPackageNameSync() === 'com.android.vending'
    Linking.openURL(
      isInstalledByGooglePlay
        ? `https://play.google.com/store/apps/details?id=${bundleId}`
        : 'https://drive.proton.me/urls/KVVQJYW4AR#thRbnPfar0hp'
    )
  }
}
