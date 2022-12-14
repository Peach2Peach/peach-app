import { info } from '../../log'
import { accountStorage } from '../accountStorage'

export const storePaymentData = async (paymentData: Account['paymentData']) => {
  info('storePaymentData - Storing payment data')

  accountStorage.setArray('paymentData', paymentData)
}
