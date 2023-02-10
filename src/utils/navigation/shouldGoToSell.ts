import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { PushNotification } from './handlePushNotification'

export const shouldGoToSell = (remoteMessage: FirebaseMessagingTypes.RemoteMessage & { data: PushNotification }) =>
  !!remoteMessage.data.offerId && remoteMessage.messageType === 'offer.notFunded'
