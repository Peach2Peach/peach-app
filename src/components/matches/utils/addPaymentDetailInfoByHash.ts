import { PaymentDataInfoFields, PaymentDetailInfo } from '../../../store/usePaymentDataStore'

const isValueInHashMap = (
  value: string,
  hashMap?: Record<string, string>,
): hashMap is Record<string, string> & { [value: string]: string } => !!hashMap?.[value]

export const addPaymentDetailInfoByHash =
  (paymentDatailInfo: PaymentDetailInfo) => (obj: PaymentDataInfo, hash: string) => {
    for (const paymentDataField of PaymentDataInfoFields) {
      const hashMap = paymentDatailInfo[paymentDataField]
      if (isValueInHashMap(hash, hashMap)) {
        const value = hashMap[hash]
        return {
          ...obj,
          [paymentDataField]: value,
        }
      }
    }
    return obj
  }
