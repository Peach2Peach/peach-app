import { PaymentDataInfoFields } from '../../store/usePaymentDataStore'
import { isDefined } from '../validation/isDefined'

type ItemWithUnknownValue = { field: PaymentDataField; value?: string }
type Item = { field: PaymentDataField; value: string }
const isItemDefined = (item?: ItemWithUnknownValue): item is Item =>
  !!item && isDefined(item.field) && isDefined(item.value)

export const getPaymentDataInfoFields = (paymentData: PaymentData) =>
  PaymentDataInfoFields.map((field) => ({ field, value: paymentData[field] })).filter(isItemDefined)
