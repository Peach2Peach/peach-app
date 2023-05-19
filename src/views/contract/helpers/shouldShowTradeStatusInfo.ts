import { isPaymentTooLate } from '../../../utils/contract/status/isPaymentTooLate'

export const shouldShowTradeStatusInfo = (
  contract: Pick<Contract, 'paymentMade' | 'paymentExpectedBy' | 'canceled' | 'cancelationRequested'>,
  view: ContractViewer,
) =>
  (isPaymentTooLate(contract) && view === 'seller')
  || contract.canceled
  || (contract.cancelationRequested && view === 'buyer')
