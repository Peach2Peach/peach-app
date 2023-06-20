import { useNavigation } from '../../../hooks'
import { isContractSummary } from '../utils'
import { getNavigationDestinationForContract } from '../utils/navigation/getNavigationDestinationForContract'
import { useHandleRefund } from './useHandleRefund'
import { useNavigateToContractPopups } from './useNavigateToContractPopups'

export const useNavigateToContract = (item: TradeSummary) => {
  const navigation = useNavigation()
  const handleRefund = useHandleRefund()
  const showContractPopup = useNavigateToContractPopups(item.id)

  const navigateToContract = async () => {
    if (!isContractSummary(item)) return
    const destination = await getNavigationDestinationForContract(item)
    const refundHandled = await handleRefund(item.tradeStatus, item.offerId)
    if (refundHandled) return

    navigation.navigate(...destination)
    showContractPopup()
  }

  return navigateToContract
}
