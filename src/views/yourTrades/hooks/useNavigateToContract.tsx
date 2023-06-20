import { useNavigation } from '../../../hooks'
import { useStartRefundPopup } from '../../../popups/useStartRefundPopup'
import { queryClient } from '../../../queryClient'
import { getOffer, isSellOffer } from '../../../utils/offer'
import { isContractSummary } from '../utils'
import { getNavigationDestinationForContract } from '../utils/navigation/getNavigationDestinationForContract'
import { useNavigateToContractPopups } from './useNavigateToContractPopups'

export const useNavigateToContract = (item: TradeSummary) => {
  const navigation = useNavigation()
  const startRefund = useStartRefundPopup()
  const showContractPopup = useNavigateToContractPopups(item.id)

  const navigateToContract = async () => {
    if (!isContractSummary(item)) return
    const destination = await getNavigationDestinationForContract(item)

    if (item.tradeStatus === 'refundTxSignatureRequired') {
      const sellOffer = getOffer(item.offerId)
      if (sellOffer && isSellOffer(sellOffer)) {
        queryClient.setQueryData(['offer', sellOffer.id], sellOffer)
        startRefund(sellOffer)
      }
      // TODO: get ack for this change and test it + extract into reusable hook (useNavigateToOffer)
      return
    }

    navigation.navigate(...destination)
    showContractPopup()
  }

  return navigateToContract
}
