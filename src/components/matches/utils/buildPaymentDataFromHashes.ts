import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { isCashTrade } from '../../../utils/paymentMethod'
import { addPaymentDetailInfoByHash } from './addPaymentDetailInfoByHash'

export const buildPaymentDataFromHashes = (hashes: string[], selectedPaymentMethod: PaymentMethod) => {
  const partialPaymentData = isCashTrade(selectedPaymentMethod)
    ? { type: selectedPaymentMethod }
    : hashes.reduce(addPaymentDetailInfoByHash(usePaymentDataStore.getState().paymentDetailInfo), {} as PaymentDataInfo)

  if (Object.keys(partialPaymentData).length === 0) {
    return undefined
  }

  return usePaymentDataStore.getState().searchPaymentData(partialPaymentData)[0]
}
