import { useOfferPreferences } from '../../../store/offerPreferenes'
import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { loadPaymentData } from '../../../utils/account'

export const migratePaymentDataToStore = () => {
  if (usePaymentDataStore.getState().migrated) return
  const paymentData = loadPaymentData()
  paymentData.forEach(usePaymentDataStore.getState().addPaymentData)
  useOfferPreferences.getState().setPaymentMethods(paymentData.map((method) => method.id))
  usePaymentDataStore.getState().setMigrated()
}
