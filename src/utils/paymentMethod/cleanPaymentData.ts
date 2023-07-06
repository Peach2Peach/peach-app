import { getPaymentDataInfoFields } from '.'

export const cleanPaymentData = (data: PaymentData) =>
  getPaymentDataInfoFields(data).reduce((obj, { field, value }) => {
    obj[field] = value
    return obj
  }, {} as PaymentDataInfo)
