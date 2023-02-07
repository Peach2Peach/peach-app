import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { getContract } from '../contract'
import {
  shouldGoToContract,
  shouldGoToContractChat,
  shouldGoToOffer,
  shouldGoToYourTradesSell,
  shouldGoToSearch,
  shouldGoToSell,
} from './utils'

export type StackNavigation = StackNavigationProp<RootStackParamList, keyof RootStackParamList>
export type Navigation = NavigationContainerRefWithCurrent<RootStackParamList> | StackNavigation

export type PushNotification = {
  offerId?: string
  contractId?: string
  isChat?: string
}

export const handlePushNotification = (
  navigationRef: Navigation,
  remoteMessage: FirebaseMessagingTypes.RemoteMessage & { data: PushNotification },
): boolean => {
  if (shouldGoToContract(remoteMessage)) {
    const {
      data: { contractId, sentTime },
    } = remoteMessage
    const contract = getContract(contractId)
    navigationRef.navigate('contract', {
      contract: contract
        ? {
          ...contract,
          paymentMade: sentTime ? new Date(sentTime) : new Date(),
        }
        : undefined,
      contractId,
    })
  } else if (shouldGoToContractChat(remoteMessage)) {
    const {
      data: { contractId },
    } = remoteMessage

    navigationRef.navigate('contractChat', { contractId })
  } else if (shouldGoToYourTradesSell(remoteMessage)) {
    navigationRef.navigate('yourTrades', { tab: 'sell' })
  } else if (shouldGoToSell(remoteMessage)) {
    navigationRef.navigate('sell')
  } else if (shouldGoToSearch(remoteMessage)) {
    const {
      data: { offerId },
    } = remoteMessage
    navigationRef.navigate('search', { offerId })
  } else if (shouldGoToOffer(remoteMessage)) {
    const {
      data: { offerId },
    } = remoteMessage
    navigationRef.navigate('offer', { offerId })
  } else {
    return false
  }

  return true
}
