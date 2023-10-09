import { useCallback } from 'react'
import { useNavigation } from '.'
import { getNavigationDestinationForContract } from '../utils/contract'
import { getNavigationDestinationForOffer, isContractSummary } from '../views/yourTrades/utils'

export const useNavigateToOfferOrContract = (item?: TradeSummary) => {
  const navigation = useNavigation()

  const navigateToOfferOrContract = useCallback(async () => {
    if (!item) return
    const destination = isContractSummary(item)
      ? await getNavigationDestinationForContract(item)
      : getNavigationDestinationForOffer(item)

    navigation.navigate(...destination)
  }, [item, navigation])

  return navigateToOfferOrContract
}
