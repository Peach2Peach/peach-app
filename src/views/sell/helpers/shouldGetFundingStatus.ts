export const shouldGetFundingStatus = (offer: SellOffer) =>
  !!offer.escrow && !offer.refunded && !offer.released && offer.funding.status !== 'FUNDED'
