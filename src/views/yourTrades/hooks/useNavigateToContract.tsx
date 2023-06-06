import { useNavigation } from '../../../hooks'
import { useStartRefundPopup } from '../../../popups/useStartRefundPopup'
import { getOffer } from '../../../utils/offer'
import { getNavigationDestinationForContract } from '../utils/navigation/getNavigationDestinationForContract'
import { shouldOpenPopup } from '../utils/shouldOpenPopup'
import { useNavigateToContractPopups } from './useNavigateToContractPopups'

export const useNavigateToContract = (contractSummary: ContractSummary) => {
  const navigation = useNavigation()
  const startRefund = useStartRefundPopup()
  const showContractPopup = useNavigateToContractPopups(contractSummary.id)

  const navigateToContract = async () => {
    const [screen, params] = await getNavigationDestinationForContract(contractSummary)

    if (shouldOpenPopup(contractSummary.tradeStatus)) {
      const sellOffer = getOffer(contractSummary.offerId) as SellOffer
      if (sellOffer) startRefund(sellOffer)
    }

    navigation.navigate(screen, params)
    showContractPopup()
  }

  return navigateToContract
}
