import { isPaymentTooLate } from '../../../utils/contract/status/isPaymentTooLate'
import i18n from '../../../utils/i18n'
import { isCashTrade } from '../../../utils/paymentMethod/isCashTrade'

export const getBuyerStatusText = (contract: Contract) => {
  const buyerCanceledTrade = !contract.cancelationRequested && contract.canceledBy === 'buyer'
  const collaborativeTradeCancel = contract.cancelationRequested
  const isCash = isCashTrade(contract.paymentMethod)
  if (isCash && contract.canceled) {
    return i18n(
      contract.canceledBy === 'buyer'
        ? 'contract.buyer.buyerCanceledCashTrade'
        : 'contract.buyer.sellerCanceledCashTrade',
    )
  }

  const paymentWasTooLate = isPaymentTooLate(contract)
  if (buyerCanceledTrade) {
    return i18n('contract.buyer.buyerCanceledTrade')
  } else if (collaborativeTradeCancel) {
    const isResolved = contract.canceled
    return i18n(
      isResolved ? 'contract.buyer.collaborativeCancel.resolved' : 'contract.buyer.collaborativeCancel.notResolved',
    )
  } else if (paymentWasTooLate) {
    return i18n(
      contract.canceled ? 'contract.buyer.paymentWasTooLate' : 'contract.buyer.paymentWasTooLate.waitingForSeller',
    )
  }
  if (contract.disputeWinner === 'seller') {
    return i18n('contract.buyer.disputeLost')
  }
  const isResolved = !!contract.releaseTxId
  return i18n(isResolved ? 'contract.buyer.disputeWon.paidOut' : 'contract.buyer.disputeWon.awaitingPayout')
}
