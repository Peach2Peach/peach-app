import { useMatchStore } from '../../../components/matches/store'
import { useNavigation } from '../../../hooks'
import { useConfirmEscrowOverlay } from '../../../overlays/useConfirmEscrowOverlay'
import { useStartRefundOverlay } from '../../../overlays/useStartRefundOverlay'
import { isSellOffer } from '../../../utils/offer'
import { getOfferDetails } from '../../../utils/peachAPI'
import { getNavigationDestinationForOffer } from '../utils/getNavigationDestination'
import { shouldOpenOverlay } from '../utils/shouldOpenOverlay'

export const useNavigateToOffer = (offer: OfferSummary) => {
  const navigation = useNavigation()
  const matchStoreSetOffer = useMatchStore((state) => state.setOffer)
  const showStartRefundOverlay = useStartRefundOverlay()
  const showConfirmEscrowOverlay = useConfirmEscrowOverlay()

  return async () => {
    const [screen, params] = getNavigationDestinationForOffer(offer)
    if (shouldOpenOverlay(offer.tradeStatus)) {
      const [sellOffer] = await getOfferDetails({ offerId: offer.id })
      if (sellOffer && isSellOffer(sellOffer)) {
        if (offer.tradeStatus === 'refundTxSignatureRequired') showStartRefundOverlay(sellOffer)
        if (offer.tradeStatus === 'fundingAmountDifferent') showConfirmEscrowOverlay(sellOffer)
      }
    }
    if (screen === 'fundEscrow') {
      const [sellOffer] = await getOfferDetails({ offerId: offer.id })
      if (sellOffer && isSellOffer(sellOffer)) return navigation.navigate(screen, { offer: sellOffer })
    }
    if (screen === 'search') {
      const [offr] = await getOfferDetails({ offerId: offer.id })
      if (offr) matchStoreSetOffer(offr)
    }
    return navigation.navigate(screen, params)
  }
}
