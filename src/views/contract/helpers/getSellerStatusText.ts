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

  if (paymentWasTooLate && !contract.canceled) {
    return i18n('contract.seller.paymentTimerHasRunOut.text', contractIdToHex(contract.id))
  }

  const isResolved = sellOffer.refunded || sellOffer.newOfferId
  if (isResolved) {
    const isRepublished = !!sellOffer.newOfferId
    if (isRepublished) {
      return i18n('contract.seller.republished')
    }
    return i18n('contract.seller.refunded', getWalletLabelFromContract({ contract, isPeachWalletActive }))
  }
  if (hasDisputeWinner) {
    return getSellerDisputeStatusText(contract)
  }

  const isRepublishAvailable = contract.tradeStatus === 'refundOrReviveRequired'
  if (isRepublishAvailable) {
    if (contract.canceledBy === 'buyer' && !contract.cancelationRequested) {
      return i18n(
        'contract.seller.refundOrRepublish.offer',
        getWalletLabelFromContract({ contract, isPeachWalletActive }),
      )
    }
    return i18n('contract.seller.refundOrRepublish.trade', getWalletLabelFromContract({ contract, isPeachWalletActive }))
  }
  if (contract.canceledBy === 'buyer' && !contract.cancelationRequested) {
    return i18n('contract.seller.refund.buyerCanceled')
  }
  return i18n('contract.seller.refund')
}
