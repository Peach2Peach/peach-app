import { account } from '../account'
import { hashPaymentData } from '../paymentMethod'

/**
 * @description Method to get payment data from offer by id
 * Use account payment data as fallback
 * @param offer the offer
 * @param paymentMethod payment method to get data for
 * @returns payment data or undefined
 */
// TODO: find a way to avoid passing paymentdata all the way down to here
export const getPaymentDataByMethod = (
  offer: BuyOffer | SellOffer,
  paymentMethod: PaymentMethod,
): PaymentData | undefined => {
  const paymentData = offer.originalPaymentData
    ? offer.originalPaymentData.filter((data) => data.type === paymentMethod)
    : Object.values(account.paymentData).filter((data) => data.type === paymentMethod)

  const paymentDataHashes = paymentData.map(hashPaymentData)
  const index = paymentDataHashes.indexOf(offer.paymentData[paymentMethod]!.hash || '')

  return paymentData[index]
}
