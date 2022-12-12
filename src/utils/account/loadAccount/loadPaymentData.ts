import { defaultAccount } from '../'
import { error } from '../../log'
import { paymentDataStorage } from '../../storage'

export const loadPaymentData = async (): Promise<Account['paymentData']> => {
  const paymentData = await paymentDataStorage.indexer.maps.getAll()

  if (paymentData) return paymentData as Account['paymentData']

  error('Could not load paymentData')
  return defaultAccount.paymentData
}
