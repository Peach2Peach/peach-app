import { BuyOffer, SellOffer } from "../../../peach-api/src/@types/offer";

export const isSellOffer = (offer: BuyOffer | SellOffer): offer is SellOffer =>
  offer.type === "ask";
