import { account } from '.'
import { getPaymentData } from './getPaymentData'
import { storePaymentData } from './storeAccount'

export const addPaymentData = async (data: PaymentData, save = true) => {
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

  if (save) await storePaymentData(account.paymentData)
}
