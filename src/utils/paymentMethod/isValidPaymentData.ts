import { paymentMethodAllowedForCurrencies, somePaymentDataExists } from '.'

export const isValidPaymentData = (data: PaymentData) => {
  if (data.type.includes('cash.')) return true
  if (!paymentMethodAllowedForCurrencies(data.type, data.currencies)) return false

  return somePaymentDataExists(data)
}
