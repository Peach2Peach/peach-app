import { useCallback } from 'react'
import { useNavigation } from '.'
import { getNavigationDestinationForContract } from '../utils/contract'
import { useDisputeEmailPopup } from '../views/yourTrades/hooks/useDisputeEmailPopup'
import { getNavigationDestinationForOffer, isContractSummary } from '../views/yourTrades/utils'

export const useNavigateToOfferOrContract = (item?: TradeSummary) => {
  const navigation = useNavigation()
  const showContractPopup = useDisputeEmailPopup(item?.id || '')

  const navigateToOfferOrContract = useCallback(async () => {
    if (!item) return
    const destination = isContractSummary(item)
      ? await getNavigationDestinationForContract(item)
      : getNavigationDestinationForOffer(item)

    navigation.navigate(...destination)
    if (isContractSummary(item)) showContractPopup()
  }, [item, navigation, showContractPopup])

  return navigateToOfferOrContract
}
