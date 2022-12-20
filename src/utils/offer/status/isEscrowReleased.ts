export const isEscrowReleased = (offer: SellOffer) => offer.refunded || offer.released || offer.txId
