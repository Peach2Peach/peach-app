import { getPaymentMethods } from '../../utils/paymentMethod/getPaymentMethods'
import { paymentMethodAllowedForCurrency } from '../../utils/paymentMethod/paymentMethodAllowedForCurrency'

export const getAvailableMethods = (
  matchMeansOfPayment: Match['meansOfPayment'],
  currency: Currency,
  mopsInCommon: Partial<Record<Currency, PaymentMethod[]>>,
) => {
  const paymentMethodsInCommon = getPaymentMethods(mopsInCommon)
  const allPaymentMethods = getPaymentMethods(matchMeansOfPayment)
  const availableMethods = (paymentMethodsInCommon.length ? paymentMethodsInCommon : allPaymentMethods)
    .filter((p) => paymentMethodAllowedForCurrency(p, currency))
    .filter((p) => mopsInCommon[currency]?.includes(p))

  return availableMethods
}
