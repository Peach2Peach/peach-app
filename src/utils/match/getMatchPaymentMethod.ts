import { getMoPsInCommon, hasMoPsInCommon } from '../paymentMethod'

/**
 * @description Method to determine payment method which is to be selected by default
 * @param offer matching offer
 * @param match matched offer
 * @param currency selected currency
 * @returns payment method to select by default
 */
export const getMatchPaymentMethod = (offer: BuyOffer|SellOffer, match: Match, currency: Currency) => {
  const mops = hasMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
    ? getMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
    : match.meansOfPayment

  return match.selectedPaymentMethod || mops[currency]![0]
}