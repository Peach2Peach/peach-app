import { account } from '.'
import { storePaymentData } from './storeAccount'

export const updatePaymentData = (paymentData: PaymentData[]) => {
  account.paymentData = paymentData
  storePaymentData(account.paymentData)
}
