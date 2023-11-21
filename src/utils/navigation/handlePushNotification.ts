import { NavigationContainerRefWithCurrent } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { getContract, getOfferDetails } from '../peachAPI'
import { isDefined } from '../validation'
import { shouldGoToContract } from './shouldGoToContract'
import { shouldGoToContractChat } from './shouldGoToContractChat'
import { shouldGoToOfferPublished } from './shouldGoToOfferPublished'
import { shouldGoToSearch } from './shouldGoToSearch'
import { shouldGoToSell } from './shouldGoToSell'
import { shouldGoToYourTradesSell } from './shouldGoToYourTradesSell'

export type StackNavigation = StackNavigationProp<RootStackParamList, keyof RootStackParamList>
export type Navigation = NavigationContainerRefWithCurrent<RootStackParamList> | StackNavigation

export const handlePushNotification = async (
  navigationRef: Navigation,
  { data }: { data: PNData },
): Promise<boolean> => {
  if (isDefined(data.badges)) {
    navigationRef.navigate('newBadge', {
      badges: data.badges,
    })

    return true
  }

  if (shouldGoToContract(data)) {
    const { contractId, sentTime } = data
    const [contract] = await getContract({ contractId })
    navigationRef.navigate('contract', {
      contract: contract
        ? {
          ...contract,
          paymentMade: sentTime ? new Date(sentTime) : new Date(),
        }
        : undefined,
      contractId,
    })
  } else if (shouldGoToContractChat(data)) {
    const { contractId } = data
    navigationRef.navigate('contractChat', { contractId })
  } else if (shouldGoToYourTradesSell(data)) {
    navigationRef.navigate('yourTrades', { tab: 'yourTrades.sell' })
  } else if (shouldGoToSell(data)) {
    navigationRef.navigate('sell')
  } else if (isDefined(data.offerId)) {
    const [offer] = await getOfferDetails({ offerId: data.offerId })
    const { offerId } = data
    if (shouldGoToSearch(data.type, !!(offer?.matches && offer.matches.length > 0))) {
      navigationRef.navigate('search', { offerId })
    } else if (shouldGoToOfferPublished(data.type)) {
      navigationRef.navigate('offerPublished', { offerId, isSellOffer: true, shouldGoBack: true })
    } else {
      navigationRef.navigate('offer', { offerId })
    }
  } else {
    return false
  }

  return true
}
