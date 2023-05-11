import { useCallback, useContext } from 'react'
import { OverlayContext } from '../contexts/overlay'
import { CancelOffer } from '../overlays/CancelOffer'
import { useStartRefundOverlay } from '../overlays/useStartRefundOverlay'
import i18n from '../utils/i18n'
import { cancelAndSaveOffer, isBuyOffer } from '../utils/offer'
import { useNavigation } from './useNavigation'
import { useShowAppPopup } from './useShowAppPopup'
import { useShowErrorBanner } from './useShowErrorBanner'

export const useCancelOffer = (offer: BuyOffer | SellOffer | null | undefined) => {
  const navigation = useNavigation()
  const showError = useShowErrorBanner()
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])

  const showOfferCanceled = useShowAppPopup('offerCanceled')
  const startRefund = useStartRefundOverlay()

  const confirmCancelOffer = useCallback(async () => {
    if (!offer) return
    const [cancelResult, cancelError] = await cancelAndSaveOffer(offer)

    if (!cancelResult || cancelError) {
      showError(cancelError?.error)
      return
    }

    if (isBuyOffer(offer) || offer.funding.status === 'NULL' || offer.funding.txIds.length === 0) {
      showOfferCanceled()
      navigation.replace(isBuyOffer(offer) ? 'buy' : 'sell')
    } else {
      startRefund(offer)
    }
  }, [navigation, offer, showError, showOfferCanceled, startRefund])

  const cancelOffer = useCallback(() => {
    if (!offer) return
    updateOverlay({
      title: i18n('offer.cancel.popup.title'),
      content: <CancelOffer offer={offer} />,
      visible: true,
      level: 'DEFAULT',
      action2: {
        label: i18n('neverMind'),
        icon: 'arrowLeftCircle',
        callback: closeOverlay,
      },
      action1: {
        label: i18n('cancelOffer'),
        icon: 'xCircle',
        callback: confirmCancelOffer,
      },
    })
  }, [closeOverlay, confirmCancelOffer, offer, updateOverlay])

  return cancelOffer
}
