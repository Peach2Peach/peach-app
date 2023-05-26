import { account } from '.'
import { settingsStore } from '../../store/settingsStore'
import { hashPaymentData } from '../paymentMethod'
import { deletePaymentHash } from '../peachAPI'
import { getPaymentData } from './getPaymentData'
import { getPaymentDataByType } from './getPaymentDataByType'
import { storePaymentData } from './storeAccount'

export const removePaymentData = async (id: PaymentData['id']) => {
  const dataToBeRemoved = getPaymentData(id)
  if (!dataToBeRemoved) return

  const [result, err] = await deletePaymentHash({ hash: hashPaymentData(dataToBeRemoved) })

  if (!result && err?.error !== 'UNAUTHORIZED' && err?.error !== 'AUTHENTICATION_FAILED') {
    throw new Error('NETWORK_ERROR')
  }

  account.paymentData = account.paymentData.filter((data) => data.id !== id)

  const preferredPaymentMethods = settingsStore.getState().preferredPaymentMethods

  if (preferredPaymentMethods[dataToBeRemoved.type]) {
    const nextInLine = getPaymentDataByType(dataToBeRemoved.type).shift()
    settingsStore.getState().setPreferredPaymentMethods({
      ...preferredPaymentMethods,
      [dataToBeRemoved.type]: nextInLine?.id || '',
    })
  }

  await storePaymentData(account.paymentData)
}
