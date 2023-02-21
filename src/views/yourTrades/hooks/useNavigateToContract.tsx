import { useNavigation } from '../../../hooks'
import { useStartRefundOverlay } from '../../../overlays/useStartRefundOverlay'
import { getOffer } from '../../../utils/offer'
import { getNavigationDestinationForContract } from '../utils/getNavigationDestinationForContract'
import { shouldOpenOverlay } from '../utils/shouldOpenOverlay'

export const useNavigateToContract = (contract: ContractSummary) => {
  const navigation = useNavigation()
  const startRefund = useStartRefundOverlay()

  return () => {
    const [screen, params] = getNavigationDestinationForContract(contract)
    if (shouldOpenOverlay(contract.tradeStatus)) {
      const sellOffer = getOffer(contract.offerId) as SellOffer
      if (sellOffer) startRefund(sellOffer)
    }

    navigation.navigate(screen, params)
  }
}
