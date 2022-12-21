import { defaultAccount } from '../'
import { error } from '../../log'
import { accountStorage } from '../accountStorage'

export const loadPaymentData = async (): Promise<Account['paymentData']> => {
  const paymentData = accountStorage.getArray('paymentData')

  if (paymentData) return paymentData as Account['paymentData']

  error('Could not load paymentData')
  return defaultAccount.paymentData
}
