import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { getOffer } from './offer'

type PushNotificationData = {
  offerId?: string,
  contractId?: string,
  isChat?: string,
}


export const handlePushNotification = (
  data: PushNotificationData,
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>
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