import { account } from '.'
import { getPaymentData } from './getPaymentData'
import { getPaymentDataByType } from './getPaymentDataByType'
import { storePaymentData } from './storeAccount'
import { updateSettings } from './updateSettings'

/**
 * @description Method to remove payment data
 * @param id id of payment data to remove
 */
export const removePaymentData = async (id: PaymentData['id']) => {
  const dataToBeRemoved = getPaymentData(id)
  if (!dataToBeRemoved) return

  account.paymentData = account.paymentData.filter((data) => data.id !== id)

  if (account.settings.preferredPaymentMethods[dataToBeRemoved.type]) {
    const nextInLine = getPaymentDataByType(dataToBeRemoved.type).shift()
    updateSettings(
      {
        preferredPaymentMethods: {
          ...account.settings.preferredPaymentMethods,
          [dataToBeRemoved.type]: nextInLine?.id || '',
        },
      },
      true,
    )
  }

  await storePaymentData(account.paymentData)
}
