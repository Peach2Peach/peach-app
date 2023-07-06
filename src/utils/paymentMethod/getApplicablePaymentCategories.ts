import { PAYMENTCATEGORIES } from '../../constants'
import { hasApplicablePaymentMethods } from '../paymentMethod'

export const getApplicablePaymentCategories = (currency: Currency): PaymentCategory[] =>
  (Object.keys(PAYMENTCATEGORIES) as PaymentCategory[])
    .filter((category) => hasApplicablePaymentMethods(category, currency))
    .filter((category) => category !== 'cash')
