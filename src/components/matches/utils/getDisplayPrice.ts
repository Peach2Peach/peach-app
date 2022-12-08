import { getPaymentMethodInfo } from '../../../utils/paymentMethod'
import { padString } from '../../../utils/string'

export const getDisplayPrice = (match: Match, selectedPaymentMethod: PaymentMethod, selectedCurrency: Currency) => {
  const paymentInfo = getPaymentMethodInfo(selectedPaymentMethod)
  let displayPrice = String(
    match.matched && match.matchedPrice
      ? match.matchedPrice
      : paymentInfo?.rounded
        ? Math.round(match.prices[selectedCurrency]!)
        : match.prices[selectedCurrency],
  )
  displayPrice = `${displayPrice.split('.')[0]}.${padString({
    string: displayPrice.split('.')[1],
    length: 2,
    char: '0',
    side: 'right',
  })}`

  return displayPrice
}
