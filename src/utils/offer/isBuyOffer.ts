import { BuyOffer, SellOffer } from "../../../peach-api/src/@types/offer";

export const isBuyOffer = (offer: BuyOffer | SellOffer): offer is BuyOffer =>
  offer.type === "bid";
