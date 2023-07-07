import { PAYMENTCATEGORIES } from '../../constants'
import { keys } from '../object'
import { hasApplicablePaymentMethods } from '../paymentMethod'

export const getApplicablePaymentCategories = (currency: Currency): PaymentCategory[] =>
  keys(PAYMENTCATEGORIES)
    .filter((category) => hasApplicablePaymentMethods(category, currency))
    .filter((category) => category !== 'cash')
