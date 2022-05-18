import { account, saveAccount } from '.'
import { session } from '../session'

/**
 * @description Method to update account payment data
 * @param paymentData settings to update
 */
export const updatePaymentData = async (paymentData: PaymentData[]) => {
  account.paymentData = paymentData
  if (session.password) await saveAccount(account, session.password)
}