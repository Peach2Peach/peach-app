import { getMoPsInCommon, hasMoPsInCommon } from '../paymentMethod'
import { getMatchCurrency } from './getMatchCurrency'

/**
 * @description Method to determine payment method which is to be selected by default
 * @param offer matching offer
 * @param match matched offer
 * @returns payment method to select by default
 */
export const getMatchPaymentMethod = (offer: BuyOffer | SellOffer, match: Match) => {
  const currency = getMatchCurrency(offer, match)
  const mops = hasMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
    ? getMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
    : match.meansOfPayment

  return mops[currency]![0]
}
