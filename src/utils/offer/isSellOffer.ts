export const isSellOffer = (offer: Pick<BuyOffer | SellOffer, 'type'>): offer is SellOffer => offer.type === 'ask'
