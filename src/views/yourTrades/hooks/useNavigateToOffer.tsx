import { useNavigation } from '../../../hooks'
import { useConfirmEscrowOverlay } from '../../../overlays/useConfirmEscrowOverlay'
import { useStartRefundOverlay } from '../../../overlays/useStartRefundOverlay'
import { isSellOffer } from '../../../utils/offer'
import { getOfferDetails } from '../../../utils/peachAPI'
import { getNavigationDestinationForOffer } from '../utils/navigation/getNavigationDestinationForOffer'
import { shouldOpenOverlay } from '../utils/shouldOpenOverlay'

export const useNavigateToOffer = (offer: OfferSummary) => {
  const navigation = useNavigation()
  const showStartRefundOverlay = useStartRefundOverlay()
  const showConfirmEscrowOverlay = useConfirmEscrowOverlay()

  return async () => {
    const destination = getNavigationDestinationForOffer(offer)
    if (shouldOpenOverlay(offer.tradeStatus)) {
      const [sellOffer] = await getOfferDetails({ offerId: offer.id })
      if (sellOffer && isSellOffer(sellOffer)) {
        if (offer.tradeStatus === 'refundTxSignatureRequired') showStartRefundOverlay(sellOffer)
        if (offer.tradeStatus === 'fundingAmountDifferent') showConfirmEscrowOverlay(sellOffer)
      }
      return
    }

    navigation.navigate(...destination)
  }
}
