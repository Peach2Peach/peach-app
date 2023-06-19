import { useNavigation } from '../../../hooks'
import { useStartRefundPopup } from '../../../popups/useStartRefundPopup'
import { getOffer } from '../../../utils/offer'
import { isContractSummary } from '../utils'
import { getNavigationDestinationForContract } from '../utils/navigation/getNavigationDestinationForContract'
import { shouldOpenPopup } from '../utils/shouldOpenPopup'
import { useNavigateToContractPopups } from './useNavigateToContractPopups'

export const useNavigateToContract = (item: TradeSummary) => {
  const navigation = useNavigation()
  const startRefund = useStartRefundPopup()
  const showContractPopup = useNavigateToContractPopups(item.id)

  const navigateToContract = async () => {
    if (!isContractSummary(item)) return
    const destination = await getNavigationDestinationForContract(item)

    if (shouldOpenPopup(item.tradeStatus)) {
      const sellOffer = getOffer(item.offerId) as SellOffer
      if (sellOffer) startRefund(sellOffer)
    }

    navigation.navigate(...destination)
    showContractPopup()
  }

  return navigateToContract
}
