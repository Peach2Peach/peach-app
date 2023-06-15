import { useOfferPreferences } from '../../../store/offerPreferenes'
import { getNewPreferredPaymentMethods, getSelectedPaymentDataIds, updatePaymentData } from '../../../utils/account'

export const checkSupportedPaymentMethods = (paymentData: PaymentData[], paymentInfo: PaymentMethodInfo[]) => {
  const updatedPaymentData = paymentData.map((data) => ({
    ...data,
    hidden: !paymentInfo.some((info) => data.type === info.id),
  }))

  const newPreferredPaymentMethods = getNewPreferredPaymentMethods(
    useOfferPreferences.getState().preferredPaymentMethods,
    updatedPaymentData,
  )
  useOfferPreferences.getState().setPaymentMethods(getSelectedPaymentDataIds(newPreferredPaymentMethods))

  updatePaymentData(updatedPaymentData)

  return updatedPaymentData
}
