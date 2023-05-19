import i18n from '../../../utils/i18n'
import { isPaymentTooLate } from '../../../utils/contract/status/isPaymentTooLate'
import { shouldShowTradeStatusInfo } from './shouldShowTradeStatusInfo'

export const getTradeSeparatorText = (
  contract: Pick<
    Contract,
    | 'tradeStatus'
    | 'paymentMade'
    | 'paymentExpectedBy'
    | 'disputeWinner'
    | 'canceledBy'
    | 'canceled'
    | 'cancelationRequested'
  >,
  view: ContractViewer,
) => {
  const { tradeStatus, disputeWinner, canceledBy, canceled, cancelationRequested } = contract
  if (disputeWinner) {
    if (disputeWinner === view) {
      return i18n('contract.disputeWon')
    }
    return i18n('contract.disputeLost')
  }
  if (canceledBy === 'buyer' && view === 'seller' && !cancelationRequested) {
    return i18n('contract.summary.buyerCanceled')
  }

  if (isPaymentTooLate(contract) && (view === 'seller' || canceled)) {
    return i18n('contract.summary.paymentTooLate')
  }

  if (cancelationRequested && view === 'buyer' && !canceled) {
    return i18n('contract.summary.sellerWantsToCancel')
  }

  if (shouldShowTradeStatusInfo(contract, view)) {
    return i18n('contract.tradeCanceled')
  }

  if (tradeStatus === 'tradeCompleted' && view === 'buyer') {
    return i18n('contract.summary.tradeDetails')
  }
  return i18n('contract.paymentDetails')
}
