import { usePaymentDataStore } from '../../../store/usePaymentDataStore'

export const migratePaymentData = (paymentData: PaymentData[]) => {
  if (usePaymentDataStore.getState().migrated) return
  paymentData.forEach(usePaymentDataStore.getState().addPaymentData)
  usePaymentDataStore.getState().setMigrated()
}
