import { useNavigation } from '../../../hooks'
import { useStartRefundPopup } from '../../../popups/useStartRefundPopup'
import { isSellOffer } from '../../../utils/offer'
import { getOfferDetails } from '../../../utils/peachAPI'
import { getNavigationDestinationForOffer } from '../utils/navigation/getNavigationDestinationForOffer'
import { shouldOpenPopup } from '../utils/shouldOpenPopup'

export const useNavigateToOffer = (offer: OfferSummary) => {
  const navigation = useNavigation()
  const showStartRefundPopup = useStartRefundPopup()

  return async () => {
    const destination = getNavigationDestinationForOffer(offer)
    if (shouldOpenPopup(offer.tradeStatus)) {
      const [sellOffer] = await getOfferDetails({ offerId: offer.id })
      if (sellOffer && isSellOffer(sellOffer)) {
        if (offer.tradeStatus === 'refundTxSignatureRequired') showStartRefundPopup(sellOffer)
      }
      return
    }

    navigation.navigate(...destination)
  }
}
