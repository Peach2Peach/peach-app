import { info } from '../../log'
import { accountStorage } from '../accountStorage'

export const storePaymentData = (paymentData: Account['paymentData']) => {
  info('storePaymentData - Storing payment data')

  accountStorage.setArray('paymentData', paymentData)
}
