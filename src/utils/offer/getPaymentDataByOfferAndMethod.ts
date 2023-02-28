import { account } from '../account'
import { hashPaymentData } from '../paymentMethod'

/**
 * @description Method to get payment data from offer by id
 * Use account payment data as fallback
 * @param offer the offer
 * @param paymentMethod payment method to get data for
 * @returns payment data or undefined
 */
export const getPaymentDataByOfferAndMethod = (
  offer: BuyOffer | SellOffer,
  paymentMethod: PaymentMethod,
  hashedPaymentData: string,
): PaymentData | undefined => {
  const paymentData = offer.originalPaymentData
    ? offer.originalPaymentData.filter((data) => data.type === paymentMethod)
    : account.paymentData.filter((data) => data.type === paymentMethod)

  let paymentDataHashes = paymentData.map(hashPaymentData)
  let index = paymentDataHashes.indexOf(hashedPaymentData)

  if (index === -1) {
    paymentDataHashes = account.legacyPaymentData.filter((data) => data.type === paymentMethod).map(hashPaymentData)
    console.log(account.legacyPaymentData, hashedPaymentData, paymentDataHashes)
    index = paymentDataHashes.indexOf(hashedPaymentData)
  }

  return paymentData[index]
}
