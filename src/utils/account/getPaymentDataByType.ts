import { usePaymentDataStore } from '../../store/usePaymentDataStore'

export const getPaymentDataByType = (type: PaymentData['type']) =>
  usePaymentDataStore
    .getState()
    .getPaymentDataArray()
    .filter((data) => data.type === type)
