import { PAYMENTMETHODINFOS } from '../../constants'

/**
 * @description Method to check whether MoP supports given currency
 * @param paymentMethod id of MoP
 * @param currencies currencies
 * @returns true if payment method supports selected currency
 */
export const paymentMethodAllowedForCurrency = (paymentMethod: PaymentMethod, currency: Currency) => {
  const paymentMethodInfo = PAYMENTMETHODINFOS.find((info) => info.id === paymentMethod)
  return paymentMethodInfo?.currencies.some((c) => currency === c)
}
