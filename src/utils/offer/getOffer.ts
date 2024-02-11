import { BuyOffer, SellOffer } from "../../../peach-api/src/@types/offer";
import { offerKeys } from "../../hooks/query/useOfferDetail";
import { queryClient } from "../../queryClient";

export const getOffer = (id: string): SellOffer | BuyOffer | undefined =>
  queryClient.getQueryData(offerKeys.detail(id));
