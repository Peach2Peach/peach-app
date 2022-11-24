import { getCurrencies, getMoPsInCommon, getPaymentMethods, hasMoPsInCommon } from '../paymentMethod'

/**
 * @description Method to determine currency which is to be selected by default
 * @param offer matching offer
 * @param match matched offer
 * @returns currency to select by default
 */
export const getMatchCurrency = (offer: BuyOffer | SellOffer, match: Match) => {
  const mops = hasMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
    ? getMoPsInCommon(offer.meansOfPayment, match.meansOfPayment)
    : match.meansOfPayment
  const paymentMethodsInCommon = getPaymentMethods(mops)
  const currencies = getCurrencies(paymentMethodsInCommon.length ? mops : match.meansOfPayment)

  return currencies[0]
}
