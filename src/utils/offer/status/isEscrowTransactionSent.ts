export const isEscrowTransactionSent = (offer: SellOffer) => offer.funding.txIds.length > 0
