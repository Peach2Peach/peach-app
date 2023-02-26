import { getPaymentMethodInfo } from '../../../../utils/paymentMethod'

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
        ? Math.round(match.prices[selectedCurrency]!)
        : match.prices[selectedCurrency]!

  console.log(
    displayPrice,
    match.matched,
    match.matchedPrice,
    paymentInfo?.rounded,
    match.prices[selectedCurrency],
    match.prices[selectedCurrency],
  )

  return displayPrice
}
