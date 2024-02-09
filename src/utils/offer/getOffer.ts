import { BuyOffer, SellOffer } from "../../../peach-api/src/@types/offer";
import { useAccountStore } from "../account/account";

export const getOffer = (id: string): SellOffer | BuyOffer | undefined =>
  useAccountStore.getState().account.offers.find((c) => c.id === id);
