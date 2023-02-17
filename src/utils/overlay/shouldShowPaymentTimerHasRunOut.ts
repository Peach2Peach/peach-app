import { getPaymentExpectedBy } from '../../views/contract/helpers/getPaymentExpectedBy'

export const shouldShowPaymentTimerHasRunOut = (contract: Contract) => {
  if (contract.paymentMade || contract.canceled || contract.disputeActive || contract.disputeWinner) return false

  const paymentExpectedBy = getPaymentExpectedBy(contract)
  return Date.now() > paymentExpectedBy
}
