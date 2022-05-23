import { account, saveAccount } from '.'
import { session } from '../session'
import { updateSettings } from './updateSettings'

/**
 * @description Method to add account payment data
 * @param paymentData settings to add
 */
export const addPaymentData = async (data: PaymentData) => {
  if (!account.settings.preferredPaymentMethods[data.type]) {
    updateSettings({
      preferredPaymentMethods: {
        ...account.settings.preferredPaymentMethods,
        [data.type]: data.id
      }
    })
  }

  account.paymentData.push(data)

  if (session.password) await saveAccount(account, session.password)
}