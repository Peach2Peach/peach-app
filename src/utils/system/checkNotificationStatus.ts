import messaging from '@react-native-firebase/messaging'
import { checkNotifications } from 'react-native-permissions'
import { error } from '../log'
import { isIOS } from './isIOS'

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
