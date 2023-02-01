import { getPaymentExpectedBy } from '../../views/contract/helpers/getPaymentExpectedBy'

export const shouldShowPaymentTimerHasRunOut = (contract: Contract) => {
  const paymentExpectedBy = getPaymentExpectedBy(contract)
  return Date.now() > paymentExpectedBy
}
