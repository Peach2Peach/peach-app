import { hashPaymentData } from '../../../utils/paymentMethod'
import { OfferPreferences } from '../useOfferPreferences'

export const getHashedPaymentData = (paymentData: PaymentData[]): OfferPreferences['paymentData'] =>
  paymentData.reduce(
    (obj, data) => ({
      ...obj,
      [data.type]: {
        hash: hashPaymentData(data),
        country: data.country,
      },
    }),
    {},
  )
