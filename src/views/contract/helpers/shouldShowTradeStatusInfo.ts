import { isPaymentTooLate } from '../../../utils/contract/status/isPaymentTooLate'

export const shouldShowTradeStatusInfo = (
  contract: Pick<Contract, 'paymentMade' | 'paymentExpectedBy' | 'canceled' | 'cancelationRequested' | 'disputeWinner'>,
  view: ContractViewer,
) =>
  (isPaymentTooLate(contract) && view === 'seller')
  || contract.canceled
  || !!contract.disputeWinner
  || (contract.cancelationRequested && view === 'buyer')
