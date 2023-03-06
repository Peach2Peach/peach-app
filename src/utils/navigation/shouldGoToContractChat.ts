import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'

export const shouldGoToContractChat = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage & { data: PNData },
): remoteMessage is FirebaseMessagingTypes.RemoteMessage & { data: PNData & { contractId: string } } =>
  !!remoteMessage.data.contractId && remoteMessage.data.isChat === 'true'
