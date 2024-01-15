import { isPaymentTooLate } from '../../../utils/contract/status/isPaymentTooLate'

export const shouldShowTradeStatusInfo = (
  contract: Pick<
    Contract,
    'paymentMade' | 'paymentExpectedBy' | 'canceled' | 'cancelationRequested' | 'disputeWinner' | 'tradeStatus'
  >,
  view: ContractViewer,
) =>
  (isPaymentTooLate(contract) && (contract.tradeStatus === 'paymentTooLate' || view === 'buyer'))
  || contract.canceled
  || (contract.disputeWinner === 'buyer' && ['releaseEscrow', 'confirmPaymentRequired'].includes(contract.tradeStatus))
  || (contract.cancelationRequested && view === 'buyer')
