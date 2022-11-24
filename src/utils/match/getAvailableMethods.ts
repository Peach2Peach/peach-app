import { getPaymentMethods, paymentMethodAllowedForCurrency } from '../../utils/paymentMethod'

export const getAvailableMethods = (
  match: Match,
  currency: Currency,
  mopsInCommon: Partial<Record<Currency, PaymentMethod[]>>,
) => {
  const paymentMethodsInCommon = getPaymentMethods(mopsInCommon)
  const allPaymentMethods = getPaymentMethods(match.meansOfPayment)
  const availableMethods = (paymentMethodsInCommon.length ? paymentMethodsInCommon : allPaymentMethods)
    .filter((p) => paymentMethodAllowedForCurrency(p, currency))
    .filter((p) => mopsInCommon[currency]?.includes(p))

  return availableMethods
}
