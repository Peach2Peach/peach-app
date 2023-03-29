import { PAYMENTMETHODINFOS } from '../../../../../constants'

export const hasMultipleAvailableCurrencies = (paymentMethod: PaymentMethod) => {
  const selectedMethod = PAYMENTMETHODINFOS.find((pm) => pm.id === paymentMethod)
  return !!selectedMethod && selectedMethod.currencies.length > 1
}
