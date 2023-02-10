import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'

export const shouldGoToSearch = (
  messageType: FirebaseMessagingTypes.RemoteMessage['messageType'],
  hasMatches: boolean,
) =>
  messageType === 'offer.matchBuyer'
  || messageType === 'offer.matchSeller'
  || (messageType === 'offer.escrowFunded' && hasMatches)
