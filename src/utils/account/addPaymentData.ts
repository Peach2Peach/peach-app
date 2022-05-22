import { account, saveAccount } from '.'
import { paymentMethodNotYetSelected } from '../paymentMethod'
import { session } from '../session'

/**
 * @description Method to add account payment data
 * @param paymentData settings to add
 */
export const addPaymentData = async (data: PaymentData) => {
  data.selected = paymentMethodNotYetSelected(data, account.paymentData)
  account.paymentData.push(data)

  if (session.password) await saveAccount(account, session.password)
}