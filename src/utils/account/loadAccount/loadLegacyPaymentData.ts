import { defaultAccount } from '..'
import { error } from '../../log'
import { accountStorage } from '../accountStorage'

export const loadLegacyPaymentData = async (): Promise<Account['paymentData']> => {
  const paymentData = accountStorage.getArray('legacyPaymentData')

  if (paymentData) return paymentData as Account['legacyPaymentData']

  error('Could not load legacy paymentData')
  return defaultAccount.legacyPaymentData
}
