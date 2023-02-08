import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'

export const shouldGoToOfferPublished = (messageType: FirebaseMessagingTypes.RemoteMessage['messageType']) =>
  messageType === 'offer.escrowFunded'
