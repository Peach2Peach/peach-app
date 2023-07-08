import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { loadPaymentData } from '../../../utils/account'
import { accountStorage } from '../../../utils/account/accountStorage'

// To be removed by October 2023
export const migratePaymentDataToStore = () => {
  const paymentData = loadPaymentData()
  paymentData.forEach(usePaymentDataStore.getState().addPaymentData)
  accountStorage.removeItem('paymentData')
  usePaymentDataStore.getState().setMigrated()
}
