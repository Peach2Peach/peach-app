import { account, updatePaymentData } from '../../../utils/account'
import { accountStorage } from '../../../utils/account/accountStorage'
import { enforceFormatOnPaymentData } from '../../../utils/format'
import { info } from '../../../utils/log'

/**
 * Workaround to enable legacy sell offers (pre 0.2.0) double match with existing payment data
 * Shoud be removed by April 2023
 */
const storeLegacyPaymentData = async (paymentData: Account['paymentData']) => {
  info('storeLegacyPaymentData - Storing payment data')

  accountStorage.setArray('legacyPaymentData', paymentData)
}
const updateLegacyPaymentData = async (paymentData: PaymentData[]) => {
  account.legacyPaymentData = paymentData
  await storeLegacyPaymentData(account.legacyPaymentData)
}

export const enforcePaymentDataFormats = (paymentData: PaymentData[]) => {
  console.log(account.legacyPaymentData)

  if (account.legacyPaymentData.length === 0) updateLegacyPaymentData(paymentData)
  const updatedPaymentData = paymentData.map(enforceFormatOnPaymentData)
  updatePaymentData(updatedPaymentData)
}
