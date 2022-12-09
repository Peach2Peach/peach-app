export const isOfferCanceled = (offer: BuyOffer | SellOffer) =>
  !offer.online
  && !offer.contractId
  && (offer.type !== 'ask' || /WRONG_FUNDING_AMOUNT|CANCELED/u.test(offer.funding.status))
