import { settingsStore } from '../../../store/settingsStore'
import { getNewPreferredPaymentMethods, updatePaymentData } from '../../../utils/account'

export const checkSupportedPaymentMethods = (paymentData: PaymentData[], paymentInfo: PaymentMethodInfo[]) => {
  const updateDatedPaymentData = paymentData.map((data) => ({
    ...data,
    hidden: !paymentInfo.some((info) => data.type === info.id),
  }))

  const newPreferredPaymentMethods = getNewPreferredPaymentMethods(
    settingsStore.getState().preferredPaymentMethods,
    updateDatedPaymentData,
  )
  settingsStore.getState().setPreferredPaymentMethods(newPreferredPaymentMethods)

  updatePaymentData(updateDatedPaymentData)

  return updateDatedPaymentData
}
