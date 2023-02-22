export const getSummaryFromOffer = (offer: BuyOffer | SellOffer): OfferSummary => ({
  ...offer,
  prices: offer.prices ?? {},
  lastModified: offer.lastModified ?? new Date(),
  creationDate: new Date(offer.creationDate),
})
