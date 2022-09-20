/**
 * @description Method to parse offer data into a usable format
 * @param offer offer to parse
 * @returns parsed offer
 */
export const parseOffer = (offer: BuyOffer | SellOffer) => {
  offer.creationDate = new Date(offer.creationDate)
  return offer
}
