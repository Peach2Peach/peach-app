import { account } from '../account'
import { hashPaymentData } from '../paymentMethod/hashPaymentData'

/**
 * @description Method to get payment data from offer + payment data hash
 * Use account payment data as fallback
 */
export const getPaymentDataByOfferAndMethod = (
  offer: BuyOffer | SellOffer,
  paymentMethod: PaymentMethod,
  hashedPaymentData: string
): PaymentData | undefined => {
  const paymentData = offer.originalPaymentData
    ? offer.originalPaymentData.filter((data) => data.type === paymentMethod)
    : account.paymentData.filter((data) => data.type === paymentMethod)

  let paymentDataHashes = paymentData.map(hashPaymentData)
  let index = paymentDataHashes.indexOf(hashedPaymentData)

  if (index === -1) {
    paymentDataHashes = account.legacyPaymentData.filter((data) => data.type === paymentMethod).map(hashPaymentData)
    index = paymentDataHashes.indexOf(hashedPaymentData)
  }

  return paymentData[index]
}
