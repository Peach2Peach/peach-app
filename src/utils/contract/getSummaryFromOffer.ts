export const getSummaryFromOffer = (offer: BuyOffer | SellOffer) => {
  const summary: OfferSummary = {
    ...offer,
    prices: offer.prices ?? {},
    lastModified: offer.lastModified ?? new Date(),
    creationDate: new Date(offer.creationDate),
  }
  return summary
}
