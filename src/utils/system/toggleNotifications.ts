import messaging from '@react-native-firebase/messaging'
import { Linking } from 'react-native'
import { isIOS } from './isIOS'

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
