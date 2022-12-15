import { getMoPsInCommon, hasMoPsInCommon } from '../paymentMethod'
import { getMatchCurrency } from './getMatchCurrency'

export const getMatchPaymentMethod = (
  offerMeansOfPayment: (BuyOffer | SellOffer)['meansOfPayment'],
  matchMeansOfPayment: Match['meansOfPayment'],
) => {
  const currency = getMatchCurrency(offerMeansOfPayment, matchMeansOfPayment)
  const mops = hasMoPsInCommon(offerMeansOfPayment, matchMeansOfPayment)
    ? getMoPsInCommon(offerMeansOfPayment, matchMeansOfPayment)
    : matchMeansOfPayment

  return mops[currency]?.[0]
}
