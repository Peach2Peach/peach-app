import { hashPaymentData } from '../../../utils/paymentMethod'
import { extendPaymentDetailInfo } from './extendPaymentDetailInfo'
import { PaymentDetailInfo } from '../types'

export const buildPaymentDetailInfo = (data: PaymentData) => {
  const hashes = hashPaymentData(data)
  return hashes.reduce(extendPaymentDetailInfo, {} satisfies PaymentDetailInfo)
}
