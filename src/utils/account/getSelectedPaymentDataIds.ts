import { OfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'
import { getPaymentMethodInfo } from '../paymentMethod'

export const getSelectedPaymentDataIds = (preferredPaymentMethods: OfferPreferences['preferredPaymentMethods']) =>
  (Object.keys(preferredPaymentMethods) as PaymentMethod[])
    .filter(getPaymentMethodInfo)
    .reduce((arr: string[], type: PaymentMethod) => {
      const id = preferredPaymentMethods[type]
      if (!id) return arr
      return arr.concat(id)
    }, [])
