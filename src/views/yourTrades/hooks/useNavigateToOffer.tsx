import { useNavigation } from '../../../hooks'
import { useConfirmEscrowOverlay } from '../../../overlays/useConfirmEscrowOverlay'
import { useStartRefundOverlay } from '../../../overlays/useStartRefundOverlay'
import { useSettingsStore } from '../../../store/settingsStore'
import { isSellOffer } from '../../../utils/offer'
import { getOfferDetails } from '../../../utils/peachAPI'
import { getNavigationDestinationForOffer } from '../utils/getNavigationDestinationForOffer'
import { shouldOpenOverlay } from '../utils/shouldOpenOverlay'

export const useNavigateToOffer = (offer: OfferSummary) => {
  const navigation = useNavigation()
  const showStartRefundOverlay = useStartRefundOverlay()
  const showConfirmEscrowOverlay = useConfirmEscrowOverlay()
  const setPeachWalletActive = useSettingsStore((state) => state.setPeachWalletActive)

  return async () => {
    const [screen, params] = getNavigationDestinationForOffer(offer)
    if (shouldOpenOverlay(offer.tradeStatus)) {
      const [sellOffer] = await getOfferDetails({ offerId: offer.id })
      if (sellOffer && isSellOffer(sellOffer)) {
        if (offer.tradeStatus === 'refundTxSignatureRequired') showStartRefundOverlay(sellOffer)
        if (offer.tradeStatus === 'fundingAmountDifferent') showConfirmEscrowOverlay(sellOffer)
      }
      return
    }
    if (screen === 'fundEscrow') {
      const [sellOffer] = await getOfferDetails({ offerId: offer.id })
      if (sellOffer && isSellOffer(sellOffer)) {
        navigation.navigate(screen, { offer: sellOffer })
        return
      }
    }

    if (screen === 'signMessage') setPeachWalletActive(false)

    navigation.navigate(screen, params)
  }
}
