import React, { useContext } from 'react'
import { OverlayContext } from '../../contexts/overlay'
import { BuyerCanceled } from './BuyerCanceled'
import { BuyerConfirmedCancelTrade } from './BuyerConfirmedCancelTrade'
import { useStartRefundOverlay } from '../useStartRefundOverlay'
import { getSellOfferFromContract, saveContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getOfferExpiry } from '../../utils/offer'

export const useBuyerCanceledOverlay = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const startRefund = useStartRefundOverlay()

  const confirmOverlay = (contract: Contract) => {
    updateOverlay({ visible: false })
    saveContract({
      ...contract,
      cancelConfirmationDismissed: true,
      cancelConfirmationPending: false,
    })
  }

  const republishOffer = (sellOffer: SellOffer) => {
    // TODO missing endpoint from server
  }

  return (contract: Contract, mutualClose: boolean) => {
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
        callback: () => {
          confirmOverlay(contract)
          republishOffer(sellOffer)
        },
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
  }
}
