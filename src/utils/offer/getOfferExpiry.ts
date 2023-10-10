import { getEscrowExpiry } from './getEscrowExpiry'

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
