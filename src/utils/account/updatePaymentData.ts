import { account, saveAccount } from '.'
import { session } from '../sessionUtils'

/**
 * @description Method to update account payment data
 * @param paymentData settings to update
 */
export const updatePaymentData = (paymentData: PaymentData[]): void => {
  account.paymentData = paymentData
  if (session.password) saveAccount(account, session.password)
}