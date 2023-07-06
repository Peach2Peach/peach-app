import { useOfferPreferences } from '../../../store/offerPreferenes'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { getNewPreferredPaymentMethods, getSelectedPaymentDataIds } from '../../../utils/account'

export const checkSupportedPaymentMethods = (paymentInfo: PaymentMethodInfo[]) => {
  const paymentData = usePaymentDataStore.getState().getPaymentDataArray()
  const updatedPaymentData = paymentData.map((data) => ({
    ...data,
    hidden: !paymentInfo.some((info) => data.type === info.id),
  }))

  const newPreferredPaymentMethods = getNewPreferredPaymentMethods(
    useOfferPreferences.getState().preferredPaymentMethods,
    updatedPaymentData,
  )
  useOfferPreferences.getState().setPaymentMethods(getSelectedPaymentDataIds(newPreferredPaymentMethods))
  updatedPaymentData.forEach((data) => usePaymentDataStore.getState().setPaymentDataHidden(data.id, data.hidden))

  return updatedPaymentData
}
