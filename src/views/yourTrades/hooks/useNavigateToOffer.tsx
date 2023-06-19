import { useNavigation } from '../../../hooks'
import { useStartRefundPopup } from '../../../popups/useStartRefundPopup'
import { queryClient } from '../../../queryClient'
import { isSellOffer } from '../../../utils/offer'
import { getOfferDetails } from '../../../utils/peachAPI'
import { isContractSummary } from '../utils'
import { getNavigationDestinationForOffer } from '../utils/navigation/getNavigationDestinationForOffer'
import { shouldOpenPopup } from '../utils/shouldOpenPopup'

export const useNavigateToOffer = (item: TradeSummary) => {
  const navigation = useNavigation()
  const showStartRefundPopup = useStartRefundPopup()

  return async () => {
    if (isContractSummary(item)) return
    const destination = getNavigationDestinationForOffer(item)
    if (shouldOpenPopup(item.tradeStatus)) {
      const [sellOffer] = await getOfferDetails({ offerId: item.id })
      if (sellOffer && isSellOffer(sellOffer)) {
        queryClient.setQueryData(['offer', sellOffer.id], sellOffer)
        if (item.tradeStatus === 'refundTxSignatureRequired') showStartRefundPopup(sellOffer)
      }
      return
    }

    navigation.navigate(...destination)
  }
}
