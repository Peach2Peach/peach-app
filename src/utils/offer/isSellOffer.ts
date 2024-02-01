export const isSellOffer = (offer: BuyOffer | SellOffer): offer is SellOffer =>
  offer.type === "ask";
