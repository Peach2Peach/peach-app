import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { getContract } from './contract'

export type StackNavigation = StackNavigationProp<RootStackParamList, keyof RootStackParamList>
export type Navigation = NavigationContainerRefWithCurrent<RootStackParamList> | StackNavigation

type PushNotification = {
  offerId?: string
  contractId?: string
  isChat?: string
}

/**
 * @description Method to handle push notifications by navigating to corresponding view
 * @param navigationRef reference to navigation
 * @param data push notification data
 * @param sentTime time pn has been sent
 * @returns true if push notification has been handled by navigating to corresponding view
 */
export const handlePushNotification = (
  navigationRef: Navigation,
  data: PushNotification,
  sentTime?: number,
): boolean => {
  const { offerId, contractId, isChat } = data

  if (contractId && isChat !== 'true') {
    const contract = getContract(contractId)
    navigationRef.reset({
      index: 0,
      routes: [
        {
          name: 'contract',
          params: {
            contract: contract
              ? {
                ...contract,
                paymentMade: sentTime ? new Date(sentTime) : new Date(),
              }
              : undefined,
            contractId,
          },
        },
      ],
    })
    return true
  }
  if (contractId && isChat === 'true') {
    navigationRef.reset({ index: 0, routes: [{ name: 'contractChat', params: { contractId } }] })
    return true
  }
  if (offerId) {
    navigationRef.reset({ index: 0, routes: [{ name: 'offer', params: { offerId } }] })
    return true
  }

  return false
}
