import { ANONYMOUS_PAYMENTCATEGORIES } from '../../paymentMethods'

export const isLimitReached = (exceedsLimit: (keyof TradingLimit)[], selectedPaymentMethod?: PaymentMethod) => {
  if (exceedsLimit.includes('daily') || exceedsLimit.includes('yearly')) {
    return true
  }
  if (
    exceedsLimit.includes('monthlyAnonymous')
    && selectedPaymentMethod
    && ANONYMOUS_PAYMENTCATEGORIES.includes(selectedPaymentMethod)
  ) {
    return true
  }

  return false
}
