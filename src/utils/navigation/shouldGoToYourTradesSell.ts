import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'

export const shouldGoToYourTradesSell = (remoteMessage: FirebaseMessagingTypes.RemoteMessage & { data: PNData }) =>
  !!remoteMessage.data.offerId
  && (remoteMessage.messageType === 'offer.sellOfferExpired'
    || remoteMessage.messageType === 'offer.fundingAmountDifferent'
    || remoteMessage.messageType === 'offer.wrongFundingAmount')
