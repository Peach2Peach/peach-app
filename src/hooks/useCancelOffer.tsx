import { NETWORK } from '@env'
import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../contexts/overlay'
import { CancelOffer } from '../overlays/CancelOffer'
import { EscrowRefunded } from '../overlays/EscrowRefunded'
import { updateTradingLimit } from '../utils/account'
import { showTransaction } from '../utils/bitcoin'
import i18n from '../utils/i18n'
import { cancelAndSaveOffer, initiateEscrowRefund, isBuyOffer } from '../utils/offer'
import { getTradingLimit } from '../utils/peachAPI'
import { useNavigation } from './useNavigation'
import { useShowAppPopup } from './useShowAppPopup'
import { useShowErrorBanner } from './useShowErrorBanner'

export const useCancelOffer = (offer: BuyOffer | SellOffer | null | undefined) => {
  const navigation = useNavigation()
  const showError = useShowErrorBanner()
  const [, updateOverlay] = useContext(OverlayContext)

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])
  const navigateToOffer = useCallback(() => {
    closeOverlay()
    if (offer?.id) navigation.replace('offer', { offerId: offer.id })
  }, [closeOverlay, navigation, offer?.id])

  const showOfferCanceled = useShowAppPopup('offerCanceled')

  const confirmCancelOffer = useCallback(async () => {
    if (!offer) return
    const [cancelResult, cancelError] = await cancelAndSaveOffer(offer)

    if (!cancelResult || cancelError) {
      showError(cancelError?.error || 'GENERAL_ERROR')
      return
    }

    getTradingLimit({}).then(([tradingLimit]) => {
      if (tradingLimit) {
        updateTradingLimit(tradingLimit)
      }
    })

    if (isBuyOffer(offer) || offer.funding.status === 'NULL' || offer.funding.txIds.length === 0) {
      showOfferCanceled()
      navigation.replace('offer', { offerId: offer.id })
    } else {
      const [txId, refundError] = await initiateEscrowRefund(offer, cancelResult)
      if (!txId || refundError) {
        showError(refundError || 'GENERAL_ERROR')
        return
      }
      updateOverlay({
        title: i18n('offer.refunded.popup.title'),
        content: <EscrowRefunded />,
        visible: true,
        action2: {
          label: i18n('showTx'),
          icon: 'externalLink',
          callback: () => showTransaction(txId, NETWORK),
        },
        action1: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: navigateToOffer,
        },
      })
    }
  }, [navigateToOffer, navigation, offer, showError, showOfferCanceled, updateOverlay])

  const cancelOffer = useCallback(() => {
    if (!offer) return
    updateOverlay({
      title: i18n('offer.cancel.popup.title'),
      content: <CancelOffer offer={offer} />,
      visible: true,
      level: 'ERROR',
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
