import { useNavigation } from '../../../hooks'
import { useStartRefundPopup } from '../../../popups/useStartRefundPopup'
import { queryClient } from '../../../queryClient'
import { isSellOffer } from '../../../utils/offer'
import { getOfferDetails } from '../../../utils/peachAPI'
import { isContractSummary } from '../utils'
import { getNavigationDestinationForOffer } from '../utils/navigation/getNavigationDestinationForOffer'

export const useNavigateToOffer = (item: TradeSummary) => {
  const navigation = useNavigation()
  const showStartRefundPopup = useStartRefundPopup()

  return async () => {
    if (isContractSummary(item)) return
    const destination = getNavigationDestinationForOffer(item)
    if (item.tradeStatus === 'refundTxSignatureRequired') {
      const [sellOffer] = await getOfferDetails({ offerId: item.id })
      if (sellOffer && isSellOffer(sellOffer)) {
        queryClient.setQueryData(['offer', sellOffer.id], sellOffer)
        showStartRefundPopup(sellOffer)
      }
      return
    }

    navigation.navigate(...destination)
  }
}
