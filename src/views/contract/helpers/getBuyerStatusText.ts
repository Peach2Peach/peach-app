import { isPaymentTooLate } from '../../../utils/contract/status/isPaymentTooLate'
import i18n from '../../../utils/i18n'
import { isCashTrade } from '../../../utils/paymentMethod/isCashTrade'

// eslint-disable-next-line max-statements
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
      return i18n('contract.buyer.collaborativeCancel.resolved')
    }
    return i18n('contract.buyer.collaborativeCancel.notResolved')
  } else if (paymentWasTooLate) {
    if (contract.canceled) {
      return i18n('contract.buyer.paymentWasTooLate')
    }
    return i18n('contract.buyer.paymentWasTooLate.waitingForSeller')
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
