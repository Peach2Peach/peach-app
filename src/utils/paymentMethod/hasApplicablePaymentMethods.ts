import { PAYMENTCATEGORIES } from '../../constants'
import { paymentMethodAllowedForCurrency } from '../paymentMethod'

export const hasApplicablePaymentMethods = (paymentCategory: PaymentCategory, currency: Currency): boolean =>
  PAYMENTCATEGORIES[paymentCategory].filter(
    (paymentMethod) =>
      paymentMethodAllowedForCurrency(paymentMethod, currency)
      && !(paymentCategory === 'nationalOption' && paymentMethod === 'mobilePay' && currency === 'DKK')
      && !(paymentCategory === 'onlineWallet' && paymentMethod === 'mobilePay' && currency === 'EUR'),
  ).length > 0
