export const isWronglyFunded = (offer: SellOffer) => offer.funding.status === 'WRONG_FUNDING_AMOUNT'
