import { PaymentDataInfoFields } from '../../store/usePaymentDataStore'
import { sha256 } from '../crypto'
import { isDefined } from '../validation'

type ItemWithUnknownValue = { field: keyof PaymentDataInfo; value?: string }
type Item = { field: keyof PaymentDataInfo; value: string }
const isItemDefined = (item?: ItemWithUnknownValue): item is Item =>
  !!item && isDefined(item.field) && isDefined(item.value)

const hashData = (data: string) => sha256(data.toLocaleLowerCase())

export type PaymentDataHashInfo = {
  field: keyof PaymentDataInfo
  value: string
  hash: string
}

export const hashPaymentData = (paymentData: PaymentData): PaymentDataHashInfo[] =>
  PaymentDataInfoFields.map((field) => ({ field, value: paymentData[field] }))
    .filter(isItemDefined)
    .map(({ field, value }) => ({ field, value, hash: hashData(value) }))
