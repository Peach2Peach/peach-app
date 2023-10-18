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
