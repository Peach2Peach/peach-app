import { useOfferPreferences } from '../../store/offerPreferenes'
import { usePaymentDataStore } from '../../store/usePaymentDataStore'
import { hashPaymentData } from '../paymentMethod/hashPaymentData'
import { peachAPI } from '../peachAPI'
import { getSelectedPaymentDataIds } from './getSelectedPaymentDataIds'

export const removePaymentData = async (id: PaymentData['id']) => {
  const {
    getPaymentData,
    removePaymentData: removePaymentDataFromStore,
    getAllPaymentDataByType,
  } = usePaymentDataStore.getState()
  const dataToBeRemoved = getPaymentData(id)
  if (!dataToBeRemoved) return

  const hashes = hashPaymentData(dataToBeRemoved).map((item) => item.hash)
  const { result, error: err } = await peachAPI.private.user.deletePaymentHash({ hashes })

  if (!result && err?.error !== 'UNAUTHORIZED') {
    throw new Error('NETWORK_ERROR')
  }

  removePaymentDataFromStore(id)

  const preferredPaymentMethods = useOfferPreferences.getState().preferredPaymentMethods

  if (preferredPaymentMethods[dataToBeRemoved.type]) {
    const nextInLine = getAllPaymentDataByType(dataToBeRemoved.type).shift()
    const newPaymentMethods = { ...preferredPaymentMethods }
    if (nextInLine?.id) {
      newPaymentMethods[dataToBeRemoved.type] = nextInLine.id
    }

    useOfferPreferences.getState().setPaymentMethods(getSelectedPaymentDataIds(newPaymentMethods))
  } else {
    useOfferPreferences.getState().setPaymentMethods(getSelectedPaymentDataIds(preferredPaymentMethods))
  }
}
