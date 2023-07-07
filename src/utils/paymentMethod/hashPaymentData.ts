import { sha256 } from '../crypto'
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
    .map(({ field, value }) => ({ field, value, hash: hashData(value) }))
