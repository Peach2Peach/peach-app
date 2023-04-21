import { paymentMethodAllowedForCurrencies, somePaymentDataExists } from '.'
import { isCashTrade } from './isCashTrade'

/**
 * @description Method to determine whether payment data is valid
 * @param data payment data
 * @returns true if payment data is valid
 * @TODO check actual fields for validity
 */
export const isValidPaymentData = (data: PaymentData) => {
  if (isCashTrade(data.type)) return true
  if (!paymentMethodAllowedForCurrencies(data.type, data.currencies)) return false

  return somePaymentDataExists(data)
}
