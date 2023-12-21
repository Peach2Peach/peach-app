import { getPaymentMethodInfo } from '../../../utils/paymentMethod/getPaymentMethodInfo'

export const getMatchPrice = (
  match: Match,
  selectedPaymentMethod: PaymentMethod | undefined,
  selectedCurrency: Currency,
) => {
  const paymentInfo = selectedPaymentMethod ? getPaymentMethodInfo(selectedPaymentMethod) : undefined
  const displayPrice
    = match.matched && match.matchedPrice !== null
      ? match.matchedPrice
      : paymentInfo?.rounded
        ? Math.round(match.prices[selectedCurrency] ?? 0)
        : match.prices[selectedCurrency]

  return displayPrice ?? 0
}
