export const offerWithId = (offer: BuyOffer | SellOffer): offer is (BuyOffer | SellOffer) & { id: string } =>
  offer.id !== undefined
