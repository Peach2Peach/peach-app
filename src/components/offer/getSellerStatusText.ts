import { getSellOfferFromContract, getWalletLabelFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getSellerDisputeStatusText } from './getSellerDisputeStatusText'
import { isPaymentTooLate } from './isPaymentTooLate'

export const getSellerStatusText = (contract: Contract) => {
  const hasDisputeWinner = !!contract.disputeWinner
  const walletLabel = getWalletLabelFromContract(contract)
  const sellOffer = getSellOfferFromContract(contract)
  const paymentWasTooLate = isPaymentTooLate(contract)
  if (paymentWasTooLate && !contract.canceled) {
    return i18n('contract.seller.paymentWasTooLate')
  }

  const isResolved = sellOffer.refunded || sellOffer.newOfferId
  if (isResolved) {
    const isRepublished = !!sellOffer.newOfferId
    if (isRepublished) {
      return i18n('contract.seller.republished')
    }
    return i18n('contract.seller.refunded', walletLabel)
  }
  if (hasDisputeWinner) {
    return getSellerDisputeStatusText(contract)
  }

  const isRepublishAvailable = contract.tradeStatus === 'refundOrReviveRequired'
  if (isRepublishAvailable) {
    return i18n('contract.seller.refundOrRepublish', walletLabel)
  }
  return i18n('contract.seller.refund')
}
