import { sha256 } from '../crypto/sha256'
import { getPaymentDataInfoFields } from './getPaymentDataInfoFields'

const doNotHash: PaymentDataField[] = ['beneficiary', 'bic', 'name', 'reference', 'ukSortCode']
const fieldCanBeHashed = (field: PaymentDataField) => !doNotHash.includes(field)

const hashData = (data: string) => sha256(data.toLowerCase())

export type PaymentDataHashInfo = {
  field: PaymentDataField
  value: string
  hash: string
}

export const hashPaymentData = (paymentData: PaymentData): PaymentDataHashInfo[] =>
  getPaymentDataInfoFields(paymentData)
    .filter(({ field }) => fieldCanBeHashed(field))
    .filter(({ value }) => !!value)
    .map(({ field, value }) => ({ field, value, hash: hashData(value) }))
