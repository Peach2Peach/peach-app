import messaging from '@react-native-firebase/messaging'
import { useEffect } from 'react'
import { error, info } from '../../utils/log'
import { parseError } from '../../utils/system'
import { useMessageHandler } from './useMessageHandler'

export const useHandleNotifications = (getCurrentPage: () => keyof RootStackParamList | undefined) => {
  const messageHandler = useMessageHandler(getCurrentPage)

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
