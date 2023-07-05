import { account, getSelectedPaymentDataIds } from '.'
import { useOfferPreferences } from '../../store/offerPreferenes'
import { hashPaymentData } from '../paymentMethod'
import { deletePaymentHash } from '../peachAPI'
import { getPaymentData } from './getPaymentData'
import { getPaymentDataByType } from './getPaymentDataByType'
import { storePaymentData } from './storeAccount'

export const removePaymentData = async (id: PaymentData['id']) => {
  const dataToBeRemoved = getPaymentData(id)
  if (!dataToBeRemoved) return

  const hashes = hashPaymentData(dataToBeRemoved).map((item) => item.hash)
  const [result, err] = await deletePaymentHash({ hashes })

  if (!result && err?.error !== 'UNAUTHORIZED' && err?.error !== 'AUTHENTICATION_FAILED') {
    throw new Error('NETWORK_ERROR')
  }

  account.paymentData = account.paymentData.filter((data) => data.id !== id)

  const preferredPaymentMethods = useOfferPreferences.getState().preferredPaymentMethods

  if (preferredPaymentMethods[dataToBeRemoved.type]) {
    const nextInLine = getPaymentDataByType(dataToBeRemoved.type).shift()
    const newPaymentMethods = { ...preferredPaymentMethods }
    if (nextInLine?.id) {
      newPaymentMethods[dataToBeRemoved.type] = nextInLine.id
    }

    useOfferPreferences.getState().setPaymentMethods(getSelectedPaymentDataIds(newPaymentMethods))
  } else {
    useOfferPreferences.getState().setPaymentMethods(getSelectedPaymentDataIds(preferredPaymentMethods))
  }

  storePaymentData(account.paymentData)
}
