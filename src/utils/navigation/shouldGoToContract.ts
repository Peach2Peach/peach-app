import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { PushNotification } from './handlePushNotification'

export const shouldGoToContract = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage & { data: PushNotification },
): remoteMessage is FirebaseMessagingTypes.RemoteMessage & { data: PushNotification & { contractId: string } } =>
  !!remoteMessage.data.contractId && remoteMessage.data.isChat !== 'true'
