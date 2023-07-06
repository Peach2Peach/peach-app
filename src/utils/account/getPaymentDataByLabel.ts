import { usePaymentDataStore } from '../../store/usePaymentDataStore'

export const getPaymentDataByLabel = (label: PaymentData['label']) =>
  usePaymentDataStore
    .getState()
    .getPaymentDataArray()
    .find((data) => data.label === label)
