import { defaultAccount } from '../'
import { error } from '../../log'
import { accountStorage } from '../accountStorage'

export const loadPaymentData = () => {
  const paymentData = accountStorage.getArray('paymentData')

  if (paymentData) return paymentData as Account['paymentData']

  error('Could not load paymentData')
  return defaultAccount.paymentData
}
