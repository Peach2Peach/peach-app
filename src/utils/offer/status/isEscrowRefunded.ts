export const isEscrowRefunded = (offer: SellOffer) => offer.refunded || offer.released || offer.txId
