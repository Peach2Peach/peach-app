export const getSummaryFromOffer = (offer: BuyOffer | SellOffer): OfferSummary => ({
  ...offer,
  lastModified: offer.lastModified ?? new Date(),
  creationDate: new Date(offer.creationDate),
})
