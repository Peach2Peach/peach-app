import { isCashTrade } from './isCashTrade'
import { paymentMethodAllowedForCurrencies } from './paymentMethodAllowedForCurrencies'
import { somePaymentDataExists } from './somePaymentDataExists'

export const isValidPaymentData = (data: PaymentData) => {
  if (isCashTrade(data.type)) return true
  if (!paymentMethodAllowedForCurrencies(data.type, data.currencies)) return false
  return somePaymentDataExists(data)
}
