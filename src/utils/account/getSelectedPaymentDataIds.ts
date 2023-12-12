import { keys } from '../object'
import { getPaymentMethodInfo } from '../paymentMethod/getPaymentMethodInfo'

export const getSelectedPaymentDataIds = (preferredPaymentMethods: Partial<Record<PaymentMethod, string>>) =>
  keys(preferredPaymentMethods)
    .filter(getPaymentMethodInfo)
    .reduce((arr: string[], type: PaymentMethod) => {
      const id = preferredPaymentMethods[type]
      if (!id) return arr
      return arr.concat(id)
    }, [])
