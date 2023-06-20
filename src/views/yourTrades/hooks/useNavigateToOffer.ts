import { useCallback } from 'react'
import { useNavigation } from '../../../hooks'
import { isContractSummary } from '../utils'
import { getNavigationDestinationForOffer } from '../utils/navigation/getNavigationDestinationForOffer'
import { useHandleRefund } from './useHandleRefund'

export const useNavigateToOffer = (item: TradeSummary) => {
  const navigation = useNavigation()
  const handleRefund = useHandleRefund()

  const navigateToOffer = useCallback(async () => {
    if (isContractSummary(item)) return
    const destination = getNavigationDestinationForOffer(item)
    const refundHandled = await handleRefund(item.tradeStatus, item.id)
    if (refundHandled) return

    navigation.navigate(...destination)
  }, [handleRefund, item, navigation])

  return navigateToOffer
}
