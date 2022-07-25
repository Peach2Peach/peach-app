import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { getOffer } from './offer'

export type StackNavigation = StackNavigationProp<RootStackParamList, keyof RootStackParamList>
export type Navigation = NavigationContainerRefWithCurrent<RootStackParamList> | StackNavigation

type PushNotificationData = {
  offerId?: string,
  contractId?: string,
  isChat?: string,
}


export const handlePushNotification = (
  data: PushNotificationData,
  navigationRef: Navigation
) => {
  const { offerId, contractId, isChat } = data

  if (offerId) {
    const offer = getOffer(offerId)
    if (offer) navigationRef.navigate({ name: 'offer', merge: false, params: { offer } })
  }
  if (contractId && isChat !== 'true') {
    navigationRef.navigate({ name: 'contract', merge: false, params: { contractId } })
  }
  if (contractId && isChat === 'true') {
    navigationRef.navigate({ name: 'contractChat', merge: false, params: { contractId } })
  }
}