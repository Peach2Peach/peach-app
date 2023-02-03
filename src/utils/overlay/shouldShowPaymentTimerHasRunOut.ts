import { getPaymentExpectedBy } from '../../views/contract/helpers/getPaymentExpectedBy'

export const shouldShowPaymentTimerHasRunOut = (contract: Contract) => {
  if (contract.canceled) return false

  const paymentExpectedBy = getPaymentExpectedBy(contract)
  return Date.now() > paymentExpectedBy
}
