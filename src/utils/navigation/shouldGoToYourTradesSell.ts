import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'

export const shouldGoToYourTradesSell = (remoteMessage: FirebaseMessagingTypes.RemoteMessage & { data: PNData }) =>
  !!remoteMessage.data.offerId
  && (remoteMessage.data.type === 'offer.sellOfferExpired'
    || remoteMessage.data.type === 'offer.fundingAmountDifferent'
    || remoteMessage.data.type === 'offer.wrongFundingAmount')
