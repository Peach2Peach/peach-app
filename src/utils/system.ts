import { Linking, Platform } from 'react-native'
import { checkNotifications } from 'react-native-permissions'
import messaging from '@react-native-firebase/messaging'
import { getBundleId } from 'react-native-device-info'
import { DEV } from '@env'

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
export const compatibilityCheck = (version: string, minVersion: string) =>
  version >= minVersion

/**
 * @description Method to check if app is allowed to receive push notifications
 * @returns true if notifications are enabled
 */
export const checkNotificationStatus = async (): Promise<boolean> => {
  if (isIOS()) {
    const authStatus = await messaging().hasPermission()
    if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      return true
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
        sound: true,
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
    Linking.openURL(`market://details?id=${bundleId}`)
  }
}