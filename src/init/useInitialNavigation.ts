import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useCallback, useEffect } from 'react'
import { useNavigation } from '../hooks/useNavigation'
import { error, info } from '../utils/log'
import { handlePushNotification } from '../utils/navigation/handlePushNotification'
import { parseError } from '../utils/result/parseError'

const dataIsDefined = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): remoteMessage is FirebaseMessagingTypes.RemoteMessage & {
  data: {
    [key: string]: string
  }
} => !!remoteMessage.data

export const useInitialNavigation = () => {
  const navigation = useNavigation()
  const initialNavigation = useCallback(async () => {
    let initialNotification: FirebaseMessagingTypes.RemoteMessage | null = null
    try {
      initialNotification = await messaging().getInitialNotification()
    } catch (e) {
      error('messaging().getInitialNotification - Push notifications not supported', parseError(e))
    }

    if (initialNotification) {
      info('Notification caused app to open from quit state:', JSON.stringify(initialNotification))

      if (dataIsDefined(initialNotification)) {
        await handlePushNotification(navigation, initialNotification)
      }
    }

    messaging().onNotificationOpenedApp((remoteMessage) => {
      info('Notification caused app to open from background state:', JSON.stringify(remoteMessage))

      if (dataIsDefined(remoteMessage)) handlePushNotification(navigation, remoteMessage)
    })
  }, [navigation])

  useEffect(() => {
    initialNavigation()
  }, [initialNavigation])
}
