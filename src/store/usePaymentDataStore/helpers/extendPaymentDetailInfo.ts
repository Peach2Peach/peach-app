import { PaymentDataHashInfo } from '../../../utils/paymentMethod/hashPaymentData'
import { PaymentDetailInfo } from '../types'

export const extendPaymentDetailInfo = (obj: PaymentDetailInfo, { field, value, hash }: PaymentDataHashInfo) => {
  if (!obj[field]) obj[field] = {}

  // @ts-ignore
  obj[field][hash] = value
  return obj
}
