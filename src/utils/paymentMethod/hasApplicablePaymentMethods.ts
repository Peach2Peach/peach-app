import { PAYMENTCATEGORIES } from '../../constants'
import { paymentMethodAllowedForCurrency } from '../paymentMethod'

/**
 * @description Method to check whether a payment method category has applicable MoPs for given currency
 * @param paymentCategory payment category
 * @param currency currency
 * @returns true if payment category has payment method for given currency
 */
export const hasApplicablePaymentMethods = (paymentCategory: PaymentCategory, currency: Currency): boolean =>
  PAYMENTCATEGORIES[paymentCategory].filter((paymentMethod) => paymentMethodAllowedForCurrency(paymentMethod, currency))
    .length > 0
