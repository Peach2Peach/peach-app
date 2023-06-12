import { account } from '.'
import { settingsStore } from '../../store/settingsStore'
import { getPaymentData } from './getPaymentData'
import { storePaymentData } from './storeAccount'

/**
 * @description Method to add account payment data
 * @param paymentData settings to add
 * @param save if true save on account
 */
export const addPaymentData = (data: PaymentData, save = true) => {
  if (getPaymentData(data.id)) {
    // existing payment data, update
    account.paymentData = account.paymentData.map((d) => {
      if (d.id !== data.id) return d
      return data
    })
  } else {
    // otherwise add
    account.paymentData = account.paymentData.concat([data])
  }

  // if preferred payment method doesn't exist for this type, set it
  const preferredPaymentMethods = settingsStore.getState().preferredPaymentMethods
  if (!preferredPaymentMethods[data.type]) {
    settingsStore.getState().setPreferredPaymentMethods({
      ...preferredPaymentMethods,
      [data.type]: data.id,
    })
  }

  if (save) storePaymentData(account.paymentData)
}
