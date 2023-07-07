import { usePaymentDataStore } from '../../../store/usePaymentDataStore'
import { sha256 } from '../../../utils/crypto'
import { omit } from '../../../utils/object'
import { cleanPaymentData, isCashTrade } from '../../../utils/paymentMethod'
import { addPaymentDetailInfoByHash } from './addPaymentDetailInfoByHash'

const findPaymentDataByLegacyHash = (hash: string): PaymentData | undefined => {
  const paymentData = usePaymentDataStore.getState().getPaymentDataArray()
  return paymentData.find((data) => {
    const cleanedData = cleanPaymentData(data)
    const dataWithoutReference = omit(cleanedData, 'reference')
    const dataHash = sha256(JSON.stringify(dataWithoutReference).toLowerCase())
    return dataHash === hash
  })
}
export const buildPaymentDataFromHashes = (
  hashes: string[],
  selectedPaymentMethod: PaymentMethod,
): PaymentData | undefined => {
  const partialPaymentData = isCashTrade(selectedPaymentMethod)
    ? { type: selectedPaymentMethod }
    : hashes.reduce(
      addPaymentDetailInfoByHash(usePaymentDataStore.getState().paymentDetailInfo),
        {} satisfies PaymentDataInfo,
    )

  if (Object.keys(partialPaymentData).length === 0) {
    if (hashes.length === 1) return findPaymentDataByLegacyHash(hashes[0])
    return undefined
  }

  return usePaymentDataStore.getState().searchPaymentData(partialPaymentData)[0]
}
