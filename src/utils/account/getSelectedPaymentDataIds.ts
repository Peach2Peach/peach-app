import { OfferPreferences } from '../../store/offerPreferenes/useOfferPreferences'
import { keys } from '../object'
import { getPaymentMethodInfo } from '../paymentMethod'

export const getSelectedPaymentDataIds = (preferredPaymentMethods: OfferPreferences['preferredPaymentMethods']) =>
  keys(preferredPaymentMethods)
    .filter(getPaymentMethodInfo)
    .reduce((arr: string[], type: PaymentMethod) => {
      const id = preferredPaymentMethods[type]
      if (!id) return arr
      return arr.concat(id)
    }, [])
