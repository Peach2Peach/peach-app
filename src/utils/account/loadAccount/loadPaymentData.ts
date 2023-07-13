import { error } from '../../log'
import { accountStorage } from '../accountStorage'

/**
 * @deprecated
 */
export const loadPaymentData = () => {
  const paymentData = accountStorage.getArray('paymentData')

  if (paymentData) return paymentData as PaymentData[]

  error('Could not load paymentData')
  return []
}
