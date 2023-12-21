import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { useCallback, useEffect } from 'react'
import { useSetOverlay } from '../Overlay'
import { useNavigation } from '../hooks/useNavigation'
import { error, info } from '../utils/log'
import { handlePushNotification } from '../utils/navigation/handlePushNotification'
import { parseError } from '../utils/result/parseError'
import { isDefined } from '../utils/validation/isDefined'
import { NewBadge } from '../views/overlays/NewBadge'
import { OfferPublished } from '../views/search/OfferPublished'

const dataIsDefined = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): remoteMessage is FirebaseMessagingTypes.RemoteMessage & {
  data: {
    [key: string]: string
  }
} => !!remoteMessage.data

export const useInitialNavigation = () => {
  const navigation = useNavigation()
  const setOverlay = useSetOverlay()
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
        if (initialNotification.data.type === 'offer.escrowFunded') {
          setOverlay(<OfferPublished offerId={initialNotification.data.offerId} shouldGoBack />)
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
        if (remoteMessage.data.type === 'offer.escrowFunded') {
          setOverlay(<OfferPublished offerId={remoteMessage.data.offerId} shouldGoBack />)
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
