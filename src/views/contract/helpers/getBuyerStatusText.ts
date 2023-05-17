import i18n from '../../../utils/i18n'
import { isCashTrade } from '../../../utils/paymentMethod/isCashTrade'
import { isPaymentTooLate } from '../../../utils/contract/status/isPaymentTooLate'

export const getBuyerStatusText = (contract: Contract) => {
  const paymentWasTooLate = isPaymentTooLate(contract)

  const buyerCanceledTrade = !contract.cancelationRequested && contract.canceledBy === 'buyer'
  const collaborativeTradeCancel = contract.cancelationRequested
  const isCash = isCashTrade(contract.paymentMethod)
  if (isCash && contract.canceled) {
    if (contract.canceledBy === 'buyer') {
      return i18n('contract.buyer.buyerCanceledCashTrade')
    }
    return i18n('contract.buyer.sellerCanceledCashTrade')
  }

  if (buyerCanceledTrade) {
    return i18n('contract.buyer.buyerCanceledTrade')
  } else if (collaborativeTradeCancel) {
    const isResolved = contract.canceled
    if (isResolved) {
      return i18n('contract.buyer.collaborativeTradeCancel.resolved')
    }
    return i18n('contract.buyer.collaborativeTradeCancel.notResolved')
  } else if (paymentWasTooLate) {
    return i18n('contract.buyer.paymentWasTooLate')
  }
  if (contract.disputeWinner === 'seller') {
    return i18n('contract.buyer.disputeLost')
  }
  const isResolved = !!contract.releaseTxId
  if (isResolved) {
    return i18n('contract.buyer.disputeWon.paidOut')
  }
  return i18n('contract.buyer.disputeWon.awaitingPayout')
}
