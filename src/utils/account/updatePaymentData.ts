import { account } from '.'
import { storePaymentData } from './storeAccount'

/**
 * @description Method to overwrite all account payment data
 * @param paymentData settings to update
 */
export const updatePaymentData = async (paymentData: PaymentData[]) => {
  account.paymentData = paymentData
  await storePaymentData(account.paymentData)
}
