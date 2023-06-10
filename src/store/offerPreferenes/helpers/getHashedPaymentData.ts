import { hashPaymentData } from '../../../utils/paymentMethod'

export const getHashedPaymentData = (paymentData: PaymentData[]) =>
  paymentData.reduce((obj, data) => {
    const newObj = {
      ...obj,
      [data.type]: {
        hash: hashPaymentData(data),
        country: data.country,
      },
    }
    return newObj
  }, {} satisfies Offer['paymentData'])
