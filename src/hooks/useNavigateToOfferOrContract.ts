import { useCallback } from 'react'
import { useNavigation } from '.'
import { getNavigationDestinationForOffer, isContractSummary } from '../views/yourTrades/utils'
import { getNavigationDestinationForContract } from './getNavigationDestinationForContract'
import { useHandleRefund } from './useHandleRefund'
import { useNavigateToContractPopups } from './useNavigateToContractPopups'

export const useNavigateToOfferOrContract = (item?: TradeSummary) => {
  const navigation = useNavigation()
  const handleRefund = useHandleRefund()
  const showContractPopup = useNavigateToContractPopups(item?.id || '')

  const navigateToOfferOrContract = useCallback(async () => {
    if (!item) return
    const destination = isContractSummary(item)
      ? await getNavigationDestinationForContract(item)
      : getNavigationDestinationForOffer(item)

    const offerId = isContractSummary(item) ? item.offerId : item.id
    const refundHandled = await handleRefund(item.tradeStatus, offerId)
    if (refundHandled) return

    navigation.navigate(...destination)
    if (isContractSummary(item)) showContractPopup()
  }, [handleRefund, item, navigation, showContractPopup])

  return navigateToOfferOrContract
}
