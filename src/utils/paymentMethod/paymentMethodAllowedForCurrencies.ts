import { PAYMENTMETHODINFOS } from '../../constants'

/**
 * @description Method to check whether MoP supports at least one of the given currencies
 * @param paymentMethod id of MoP
 * @param currencies currencies
 * @returns true if payment method supports at least one of the selected currencies
 */
export const paymentMethodAllowedForCurrencies = (paymentMethod: PaymentMethod, currencies: Currency[]) => {
  const paymentMethodInfo = PAYMENTMETHODINFOS.find((info) => info.id === paymentMethod)
  return paymentMethodInfo?.currencies.some((c) => currencies.includes(c))
}
