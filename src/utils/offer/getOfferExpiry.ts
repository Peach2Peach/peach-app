import { getEscrowExpiry } from './getEscrowExpiry'

/**
 * @description Method to calculate offer expiry date and time to live ms
 * Offer expiry is half the time of the escrow expiry
 * @param offer sell offer
 * @returns offer expiry
 */
export const getOfferExpiry = (offer: SellOffer): Expiry => {
  const expiry = getEscrowExpiry(offer)
  const ttl = expiry.ttl / 2
  const date = new Date(offer.publishingDate || offer.creationDate)
  date.setMilliseconds(+ttl)

  return {
    date,
    ttl,
    isExpired: new Date() > date,
  }
}
