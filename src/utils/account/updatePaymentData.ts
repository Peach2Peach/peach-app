import { account } from '.'
import { storePaymentData } from './storeAccount'

export const updatePaymentData = async (paymentData: PaymentData[]) => {
  account.paymentData = paymentData
  await storePaymentData(account.paymentData)
}
