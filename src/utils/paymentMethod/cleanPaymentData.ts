import { getPaymentDataInfoFields } from './getPaymentDataInfoFields'

export const cleanPaymentData = (data: PaymentData) =>
  getPaymentDataInfoFields(data).reduce(
    (obj: PaymentDataInfo, { field, value }) => ({
      ...obj,
      [field]: value,
    }),
    {},
  )
