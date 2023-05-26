import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useEffect } from 'react'
import { error, info } from '../../utils/log'
import { parseError } from '../../utils/result'

export const useHandleNotifications = (messageHandler: (message: FirebaseMessagingTypes.RemoteMessage) => any) => {
  useEffect(() => {
    info('Subscribe to push notifications')
    try {
      const unsubscribe = messaging().onMessage(messageHandler)

      return unsubscribe
    } catch (e) {
      error('messaging().onMessage - Push notifications not supported', parseError(e))
      return () => {}
    }
  }, [messageHandler])
}
