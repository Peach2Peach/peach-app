import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../../contexts/overlay'
import { BuyerCanceled } from './BuyerCanceled'
import { BuyerConfirmedCancelTrade } from './BuyerConfirmedCancelTrade'
import { useStartRefundOverlay } from '../useStartRefundOverlay'
import { getSellOfferFromContract, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getOfferExpiry } from '../../utils/offer'
import { reviveSellOffer } from '../../utils/peachAPI'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { useNavigation } from '../../hooks'
import { OfferRepublished } from './OfferRepublished'

export const useBuyerCanceledOverlay = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const startRefund = useStartRefundOverlay()
  const showError = useShowErrorBanner()
  const navigation = useNavigation()

  const closeOverlay = useCallback(() => updateOverlay({ visible: false }), [updateOverlay])
  const confirmOverlay = useCallback(
    (contract: Contract) => {
      closeOverlay()
      saveContract({
        ...contract,
        cancelConfirmationDismissed: true,
        cancelConfirmationPending: false,
      })
    },
    [closeOverlay],
  )

  const republishOffer = useCallback(
    async (sellOffer: SellOffer) => {
      const [reviveSellOfferResult, err] = await reviveSellOffer({ offerId: sellOffer.id })

      if (!reviveSellOfferResult || err) {
        showError(err?.error)
        closeOverlay()
        return
      }

      updateOverlay({
        title: i18n('contract.cancel.offerRepublished.title'),
        content: <OfferRepublished />,
        visible: true,
        level: 'APP',
        requireUserAction: true,
        action1: {
          label: i18n('goToOffer'),
          icon: 'arrowRightCircle',
          callback: () => {
            navigation.replace('offer', { offerId: reviveSellOfferResult.newOfferId })
            closeOverlay()
          },
        },
        action2: {
          label: i18n('close'),
          icon: 'xSquare',
          callback: () => {
            navigation.replace('offer', { offerId: sellOffer.id })
            closeOverlay()
          },
        },
      })
    },
    [closeOverlay, navigation, showError, updateOverlay],
  )

  const showBuyerCanceled = useCallback(
    (contract: Contract, mutualClose: boolean) => {
      const sellOffer = getSellOfferFromContract(contract)
      if (!sellOffer) return

      const expiry = getOfferExpiry(sellOffer)
      const refundAction = {
        label: i18n('contract.cancel.tradeCanceled.refund'),
        icon: 'download',
        callback: () => {
          confirmOverlay(contract)
          startRefund(sellOffer)
        },
      }
      const action1 = expiry.isExpired
        ? refundAction
        : {
          label: i18n('contract.cancel.tradeCanceled.republish'),
          icon: 'refreshCw',
          callback: () => republishOffer(sellOffer),
        }
      const action2 = expiry.isExpired ? undefined : refundAction

      updateOverlay({
        title: i18n(mutualClose ? 'contract.cancel.buyerConfirmed.title' : 'contract.cancel.buyerCanceled.title'),
        content: mutualClose ? <BuyerConfirmedCancelTrade contract={contract} /> : <BuyerCanceled />,
        visible: true,
        level: 'WARN',
        requireUserAction: true,
        action1,
        action2,
      })
    },
    [confirmOverlay, republishOffer, startRefund, updateOverlay],
  )

  return showBuyerCanceled
}
