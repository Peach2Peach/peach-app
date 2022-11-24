/**
 * @description Method to calculate escrow expiry date and time to live ms
 * @param offer sell offer
 * @returns escrow expiry
 */
export const getEscrowExpiry = (offer: SellOffer): Expiry => {
  const ttl = offer.funding.expiry * 10 * 60 * 1000
  const date = new Date(offer.publishingDate || offer.creationDate)
  date.setMilliseconds(+ttl)

  return {
    date,
    ttl,
    isExpired: new Date() > date,
  }
}
