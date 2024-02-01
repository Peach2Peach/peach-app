export const isBuyOffer = (offer: BuyOffer | SellOffer): offer is BuyOffer =>
  offer.type === "bid";
