/**
 * @description Method to parse offer data into a usable format
 * @param offer offer to parse
 * @returns parsed offer
 */
export const parseOffer = (offer: BuyOffer | SellOffer) => {
  offer.creationDate = new Date(offer.creationDate)
  if (offer.lastModified) offer.lastModified = new Date(offer.lastModified)
  if (offer.publishingDate) offer.publishingDate = new Date(offer.publishingDate)
  return offer
}
