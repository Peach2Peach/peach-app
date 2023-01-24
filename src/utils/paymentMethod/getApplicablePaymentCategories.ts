import { PAYMENTCATEGORIES } from '../../constants'
import { hasApplicablePaymentMethods } from '../paymentMethod'

/**
 * @description Method to get paument categories which are applicable for given currency
 * @param currency currency
 * @returns applicable payment categories
 */
export const getApplicablePaymentCategories = (currency: Currency): PaymentCategory[] =>
  (Object.keys(PAYMENTCATEGORIES) as PaymentCategory[])
    .filter((category) => hasApplicablePaymentMethods(category, currency))
    .filter((category) => category !== 'cash')
