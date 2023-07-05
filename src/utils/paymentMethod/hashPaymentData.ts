import { sha256 } from '../crypto'
import { getPaymentDataInfoFields } from './getPaymentDataInfoFields'

const hashData = (data: string) => sha256(data.toLocaleLowerCase())

export type PaymentDataHashInfo = {
  field: keyof PaymentDataInfo
  value: string
  hash: string
}

export const hashPaymentData = (paymentData: PaymentData): PaymentDataHashInfo[] =>
  getPaymentDataInfoFields(paymentData).map(({ field, value }) => ({ field, value, hash: hashData(value) }))
