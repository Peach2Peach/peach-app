import { getPaymentExpectedBy } from './getPaymentExpectedBy'

export const isPaymentTimeExpired = (contract: Contract) => {
  const paymentExpectedBy = getPaymentExpectedBy(contract)
  return Date.now() > paymentExpectedBy
}
