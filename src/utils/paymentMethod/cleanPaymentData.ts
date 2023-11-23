import { getPaymentDataInfoFields } from './getPaymentDataInfoFields'

export const cleanPaymentData = (data: PaymentData): PaymentDataInfo =>
  getPaymentDataInfoFields(data).reduce(
    (obj, { field, value }) => ({
      ...obj,
      [field]: value,
    }),
    {} satisfies PaymentDataInfo,
  )
