import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { getContract } from './contract'
import { getOffer } from './offer'

export type StackNavigation = StackNavigationProp<RootStackParamList, keyof RootStackParamList>
export type Navigation = NavigationContainerRefWithCurrent<RootStackParamList> | StackNavigation

type PushNotification = {
    offerId?: string
    contractId?: string
    isChat?: string
}


export const handlePushNotification = (
  navigationRef: Navigation,
  data: PushNotification,
  sentTime?: number,
) => {
  const { offerId, contractId, isChat } = data

  if (contractId && isChat !== 'true') {
    const contract = getContract(contractId)
    return navigationRef.navigate({ name: 'contract', merge: false, params: {
      contract: contract ? {
        ...contract,
        paymentMade: sentTime ? new Date(sentTime) : new Date()
      } : undefined,
      contractId
    } })
  }
  if (contractId && isChat === 'true') {
    return navigationRef.navigate({ name: 'contractChat', merge: false, params: { contractId } })
  }
  if (offerId) {
    const offer = getOffer(offerId)
    if (offer) return navigationRef.navigate({ name: 'offer', merge: false, params: { offer } })
  }

  return null
}