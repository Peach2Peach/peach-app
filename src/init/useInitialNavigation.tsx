import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'
import { overlayAtom } from '../App'
import { useNavigation } from '../hooks/useNavigation'
import { error, info } from '../utils/log'
import { handlePushNotification } from '../utils/navigation/handlePushNotification'
import { parseError } from '../utils/result/parseError'
import { isDefined } from '../utils/validation/isDefined'
import { NewBadge } from '../views/overlays/NewBadge'

const dataIsDefined = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): remoteMessage is FirebaseMessagingTypes.RemoteMessage & {
  data: {
    [key: string]: string
  }
} => !!remoteMessage.data

export const useInitialNavigation = () => {
  const navigation = useNavigation()
  const [, setOverlay] = useAtom(overlayAtom)
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
        if (isDefined(initialNotification.data.badges)) {
          setOverlay(<NewBadge badges={initialNotification.data.badges.split(',') as Medal[]} />)
          return
        }
        await handlePushNotification(navigation, initialNotification)
      }
    }

    messaging().onNotificationOpenedApp((remoteMessage) => {
      info('Notification caused app to open from background state:', JSON.stringify(remoteMessage))

      if (dataIsDefined(remoteMessage)) {
        if (isDefined(remoteMessage.data.badges)) {
          setOverlay(<NewBadge badges={remoteMessage.data.badges.split(',') as Medal[]} />)
          return
        }
        handlePushNotification(navigation, remoteMessage)
      }
    })
  }, [navigation, setOverlay])

  useEffect(() => {
    initialNavigation()
  }, [initialNavigation])
}
