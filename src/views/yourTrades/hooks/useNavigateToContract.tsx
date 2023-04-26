import { useNavigation } from '../../../hooks'
import { useStartRefundOverlay } from '../../../overlays/useStartRefundOverlay'
import { getOffer } from '../../../utils/offer'
import { getNavigationDestinationForContract } from '../utils/navigation/getNavigationDestinationForContract'
import { shouldOpenOverlay } from '../utils/shouldOpenOverlay'
import { useDisputeEmailPopup } from './useDisputeEmailPopup'

export const useNavigateToContract = (contract: ContractSummary) => {
  const navigation = useNavigation()
  const startRefund = useStartRefundOverlay()
  const showDisputeEmailPopup = useDisputeEmailPopup(contract.id)

  const navigateToContract = async () => {
    const [screen, params] = await getNavigationDestinationForContract(contract)
    if (shouldOpenOverlay(contract.tradeStatus)) {
      const sellOffer = getOffer(contract.offerId) as SellOffer
      if (sellOffer) startRefund(sellOffer)
    }

    navigation.navigate(screen, params)
    showDisputeEmailPopup()
  }

  return navigateToContract
}
