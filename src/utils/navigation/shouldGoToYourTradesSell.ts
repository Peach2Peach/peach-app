import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { PushNotification } from './handlePushNotification'

export const shouldGoToYourTradesSell = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage & { data: PushNotification },
) =>
  !!remoteMessage.data.offerId
  && (remoteMessage.messageType === 'offer.sellOfferExpired'
    || remoteMessage.messageType === 'offer.fundingAmountDifferent'
    || remoteMessage.messageType === 'offer.wrongFundingAmount')
