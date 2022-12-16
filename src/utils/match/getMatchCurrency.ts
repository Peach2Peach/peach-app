import { getCurrencies, getMoPsInCommon, hasMoPsInCommon } from '../paymentMethod'

export const getMatchCurrency = (
  offerMeansOfPayment: (BuyOffer | SellOffer)['meansOfPayment'],
  matchMeansOfPayment: Match['meansOfPayment'],
) => {
  const mops = hasMoPsInCommon(offerMeansOfPayment, matchMeansOfPayment)
    ? getMoPsInCommon(offerMeansOfPayment, matchMeansOfPayment)
    : matchMeansOfPayment
  const currencies = getCurrencies(mops)

  return currencies[0]
}
