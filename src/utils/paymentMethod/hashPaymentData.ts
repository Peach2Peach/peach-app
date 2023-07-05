import { PaymentDataInfoFields } from '../../store/usePaymentDataStore'
import { sha256 } from '../crypto'

const isDefined = (data?: string): data is string => !!data
const hashData = (data: string) => sha256(data.toLocaleLowerCase())

export const hashPaymentData = (paymentData: PaymentData): string[] =>
  PaymentDataInfoFields.map((field) => paymentData[field])
    .filter(isDefined)
    .map(hashData)
