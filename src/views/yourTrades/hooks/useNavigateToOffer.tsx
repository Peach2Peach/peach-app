import { useMatchStore } from '../../../components/matches/store'
import { useNavigation } from '../../../hooks'
import { useConfirmEscrowOverlay } from '../../../overlays/useConfirmEscrowOverlay'
import { useStartRefundOverlay } from '../../../overlays/useStartRefundOverlay'
import { isSellOffer } from '../../../utils/offer'
import { getOfferDetails } from '../../../utils/peachAPI'
import { getNavigationDestinationForOffer } from '../utils/getNavigationDestination'
import { shouldOpenRefundOverlay } from '../utils/shouldOpenRefundOverlay'

export const useNavigateToOffer = (offer: OfferSummary) => {
  const navigation = useNavigation()
  const matchStoreSetOffer = useMatchStore((state) => state.setOffer)
  const showStartRefundOverlay = useStartRefundOverlay()
  const showConfirmEscrowOverlay = useConfirmEscrowOverlay()

  const [screen, params] = getNavigationDestinationForOffer(offer)
  return async () => {
    if (shouldOpenRefundOverlay(offer.tradeStatus)) {
      const [sellOffer] = await getOfferDetails({ offerId: offer.id })
      if (sellOffer && isSellOffer(sellOffer)) {
        if (offer.tradeStatus === 'refundTxSignatureRequired') showStartRefundOverlay(sellOffer)
        if (offer.tradeStatus === 'fundingAmountDifferent') showConfirmEscrowOverlay(sellOffer)
      }
    }
    if (screen === 'search') {
      const [offr] = await getOfferDetails({ offerId: offer.id })
      if (offr) matchStoreSetOffer(offr)
    }
    return navigation.navigate(screen, params)
  }
}
