import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { isDefined } from '../array/isDefined'
import { getContract } from '../contract'
import { getOfferDetails } from '../peachAPI'
import { shouldGoToContract } from './shouldGoToContract'
import { shouldGoToContractChat } from './shouldGoToContractChat'
import { shouldGoToYourTradesSell } from './shouldGoToYourTradesSell'
import { shouldGoToSell } from './shouldGoToSell'
import { shouldGoToSearch } from './shouldGoToSearch'
import { shouldGoToOfferPublished } from './shouldGoToOfferPublished'

export type StackNavigation = StackNavigationProp<RootStackParamList, keyof RootStackParamList>
export type Navigation = NavigationContainerRefWithCurrent<RootStackParamList> | StackNavigation

export const handlePushNotification = async (
  navigationRef: Navigation,
  remoteMessage: FirebaseMessagingTypes.RemoteMessage & { data: PNData },
): Promise<boolean> => {
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
  } else if (isDefined(remoteMessage.data.offerId)) {
    const [offer] = await getOfferDetails({ offerId: remoteMessage.data.offerId })
    const {
      data: { offerId },
    } = remoteMessage
    if (shouldGoToSearch(remoteMessage.data.type, !!(offer?.matches && offer.matches.length > 0))) {
      navigationRef.navigate('search', { offerId })
    } else if (shouldGoToOfferPublished(remoteMessage.data.type)) {
      navigationRef.navigate('offerPublished', { isSellOffer: true })
    } else {
      navigationRef.navigate('offer', { offerId })
    }
  } else {
    return false
  }

  return true
}
