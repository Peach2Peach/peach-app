import { account, saveAccount } from '.'
import { session } from '../session'

/**
 * @description Method to remove payment data
 * @param id id of payment data to remove
 */
export const removePaymentData = async (id: PaymentData['id']) => {
  account.paymentData = account.paymentData.filter(data => data.id !== id)
  if (session.password) await saveAccount(account, session.password)
}