import { account } from '.'
import { session } from '../session'
import { storePaymentData } from './storeAccount'

/**
 * @description Method to overwrite all account payment data
 * @param paymentData settings to update
 */
export const updatePaymentData = async (paymentData: PaymentData[]) => {
  account.paymentData = paymentData
  if (session.password) await storePaymentData(account.paymentData, session.password)
}