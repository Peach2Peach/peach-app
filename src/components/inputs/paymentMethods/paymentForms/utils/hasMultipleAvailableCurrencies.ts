import { PAYMENTMETHODINFOS } from '../../../../../paymentMethods'

export const hasMultipleAvailableCurrencies = (paymentMethod: PaymentMethod) => {
  const selectedMethod = PAYMENTMETHODINFOS.find((pm) => pm.id === paymentMethod)
  return !!selectedMethod && selectedMethod.currencies.length > 1
}
