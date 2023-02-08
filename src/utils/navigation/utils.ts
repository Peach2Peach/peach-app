import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { PushNotification } from './handlePushNotification'

export const shouldGoToContract = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage & { data: PushNotification },
): remoteMessage is FirebaseMessagingTypes.RemoteMessage & { data: PushNotification & { contractId: string } } =>
  !!remoteMessage.data.contractId && remoteMessage.data.isChat !== 'true'

export const shouldGoToContractChat = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage & { data: PushNotification },
): remoteMessage is FirebaseMessagingTypes.RemoteMessage & { data: PushNotification & { contractId: string } } =>
  !!remoteMessage.data.contractId && remoteMessage.data.isChat === 'true'

export const shouldGoToYourTradesSell = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage & { data: PushNotification },
) =>
  !!remoteMessage.data.offerId
  && (remoteMessage.messageType === 'offer.sellOfferExpired'
    || remoteMessage.messageType === 'offer.fundingAmountDifferent'
    || remoteMessage.messageType === 'offer.wrongFundingAmount')

export const shouldGoToSell = (remoteMessage: FirebaseMessagingTypes.RemoteMessage & { data: PushNotification }) =>
  !!remoteMessage.data.offerId && remoteMessage.messageType === 'offer.notFunded'

export const shouldGoToSearch = (
  messageType: FirebaseMessagingTypes.RemoteMessage['messageType'],
  hasMatches: boolean,
) =>
  messageType === 'offer.matchBuyer'
  || messageType === 'offer.matchSeller'
  || (messageType === 'offer.escrowFunded' && hasMatches)

export const shouldGoToOfferPublished = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage & { data: PushNotification },
): remoteMessage is FirebaseMessagingTypes.RemoteMessage & { data: PushNotification & { offerId: string } } =>
  remoteMessage.messageType === 'offer.escrowFunded'
