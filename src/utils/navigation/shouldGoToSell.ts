import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'

export const shouldGoToSell = (remoteMessage: FirebaseMessagingTypes.RemoteMessage & { data: PNData }) =>
  !!remoteMessage.data.offerId && remoteMessage.messageType === 'offer.notFunded'
