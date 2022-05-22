/**
 * @description Method to check whether offer has at least one MoP configured
 * @param offer the offer
 * @returns true if offer has MoPs configured
 */
export const hasMopsConfigured = (offer: SellOffer|BuyOffer): boolean =>
  Object.keys(offer.meansOfPayment)
    .some(c => (offer.meansOfPayment as Required<MeansOfPayment>)[c as Currency].length > 0)

