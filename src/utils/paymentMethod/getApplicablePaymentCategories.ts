import { PAYMENTCATEGORIES } from '../../paymentMethods'
import { keys } from '../object/keys'
import { hasApplicablePaymentMethods } from '../paymentMethod/hasApplicablePaymentMethods'

export const getApplicablePaymentCategories = (currency: Currency): PaymentCategory[] =>
  keys(PAYMENTCATEGORIES)
    .filter((category) => hasApplicablePaymentMethods(category, currency))
    .filter((category) => category !== 'cash')
