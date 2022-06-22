import { account, saveAccount } from '.'
import { session } from '../session'
import { getPaymentData } from './getPaymentData'
import { updateSettings } from './updateSettings'

/**
 * @description Method to add account payment data
 * @param paymentData settings to add
 * @param save if true save on account
 */
export const addPaymentData = async (data: PaymentData, save = true) => {
  if (getPaymentData(data.id)) { // existing payment data, update
    account.paymentData = account.paymentData.map(d => {
      if (d.id !== data.id) return d
      return data
    })
  } else { // otherwise add
    account.paymentData = account.paymentData.concat([data])
  }

  // if preferred payment method doesn't exist for this type, set it
  if (!account.settings.preferredPaymentMethods[data.type]) {
    updateSettings({
      preferredPaymentMethods: {
        ...account.settings.preferredPaymentMethods,
        [data.type]: data.id
      }
    })
  }

  if (save && session.password) await saveAccount(account, session.password)
}