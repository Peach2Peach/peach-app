/* eslint-disable max-statements */
import { contractIdToHex, getSellOfferFromContract, getWalletLabelFromContract } from '../../../utils/contract'
import { isPaymentTooLate } from '../../../utils/contract/status/isPaymentTooLate'
import i18n from '../../../utils/i18n'
import { getSellerDisputeStatusText } from './getSellerDisputeStatusText'

export const getSellerStatusText = (contract: Contract, isPeachWalletActive: boolean) => {
  const [hasDisputeWinner, sellOffer, paymentWasTooLate] = [
    !!contract.disputeWinner,
    getSellOfferFromContract(contract),
    isPaymentTooLate(contract),
  ]

  if (paymentWasTooLate) {
    if (!contract.canceled) {
      return i18n('contract.seller.paymentTimerHasRunOut.text', contractIdToHex(contract.id))
    }
    i18n('contract.seller.refundOrRepublish.offer', getWalletLabelFromContract({ contract, isPeachWalletActive }))
  }

  const isResolved = sellOffer.refunded || sellOffer.newOfferId
  if (isResolved) {
    if (sellOffer.newOfferId) {
      return i18n('contract.seller.republished')
    }
    return i18n('contract.seller.refunded', getWalletLabelFromContract({ contract, isPeachWalletActive }))
  }
  if (hasDisputeWinner) {
    return getSellerDisputeStatusText(contract)
  }

  const isRepublishAvailable = contract.tradeStatus === 'refundOrReviveRequired'
  if (isRepublishAvailable) {
    if (contract.canceledBy === 'buyer') {
      if (!contract.cancelationRequested) {
        return i18n(
          'contract.seller.buyerCanceledWithoutRequest',
          getWalletLabelFromContract({ contract, isPeachWalletActive }),
        )
      }
      return i18n('contract.seller.buyerAgreedToCancel')
    }
    return i18n('contract.seller.refundOrRepublish.trade', getWalletLabelFromContract({ contract, isPeachWalletActive }))
  }
  if (contract.canceledBy === 'buyer' && !contract.cancelationRequested) {
    return i18n('contract.seller.refund.buyerCanceled')
  }
  return i18n('contract.seller.refund')
}
