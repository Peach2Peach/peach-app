import { getPaymentMethodInfo } from '../paymentMethod'
import { account } from './account'

/**
 * @description Method to get selected payment data
 * @returns selected payment data
 */
export const getSelectedPaymentDataIds = () =>
  (Object.keys(account.settings.preferredPaymentMethods) as PaymentMethod[])
    .filter((id) => getPaymentMethodInfo(id))
    .reduce((arr: string[], type: PaymentMethod) => {
      const id = account.settings.preferredPaymentMethods[type]
      if (!id) return arr
      return arr.concat(id)
    }, [])
