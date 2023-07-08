import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { loadPaymentData } from '../../../utils/account'

export const migratePaymentDataToStore = () => {
  if (usePaymentDataStore.getState().migrated) return
  const paymentData = loadPaymentData()
  paymentData.forEach(usePaymentDataStore.getState().addPaymentData)
  usePaymentDataStore.getState().setMigrated()
}
