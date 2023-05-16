import i18n from '../../utils/i18n'
import { isPaymentTooLate } from './isPaymentTooLate'

export const getTradeSeparatorText = (
  contract: Pick<Contract, 'tradeStatus' | 'paymentMade' | 'paymentExpectedBy'>,
  view: ContractViewer,
) => {
  const { tradeStatus } = contract
  if (isPaymentTooLate(contract) && view === 'seller') {
    return i18n('contract.summary.paymentTooLate')
  }
  if (tradeStatus === 'tradeCanceled') {
    return i18n('contract.tradeCanceled')
  }
  if (tradeStatus === 'refundOrReviveRequired') {
    return i18n('contract.disputeResolved')
  }
  if (tradeStatus === 'tradeCompleted') {
    return view === 'seller' ? i18n('contract.paymentDetails') : 'trade details'
  }
  return i18n('contract.paymentDetails')
}
