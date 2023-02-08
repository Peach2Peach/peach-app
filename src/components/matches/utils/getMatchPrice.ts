import { getPaymentMethodInfo } from '../../../utils/paymentMethod'

export const getMatchPrice = (
  match: Match,
  selectedPaymentMethod: PaymentMethod | undefined,
  selectedCurrency: Currency,
) => {
  const paymentInfo = selectedPaymentMethod ? getPaymentMethodInfo(selectedPaymentMethod) : undefined

  return match.matched && match.matchedPrice
    ? match.matchedPrice
    : paymentInfo?.rounded
      ? Math.round(match.prices[selectedCurrency]!)
      : match.prices[selectedCurrency]
}
