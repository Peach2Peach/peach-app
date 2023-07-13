import { hashPaymentData } from '../../../utils/paymentMethod'

export const getHashedPaymentData = (paymentData: PaymentData[]): OfferPaymentData =>
  paymentData.reduce(
    (obj, data) => ({
      ...obj,
      [data.type]: {
        hashes: hashPaymentData(data).map((item) => item.hash),
        country: data.country,
      },
    }),
    {},
  )
