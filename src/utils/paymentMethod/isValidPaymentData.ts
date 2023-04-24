import { paymentMethodAllowedForCurrencies, somePaymentDataExists } from '.'
import { isCashTrade } from './isCashTrade'

export const isValidPaymentData = (data: PaymentData) => {
  if (isCashTrade(data.type)) return true
  if (!paymentMethodAllowedForCurrencies(data.type, data.currencies)) return false

  return somePaymentDataExists(data)
}
