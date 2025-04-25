import { BuyOffer, SellOffer } from "../../../peach-api/src/@types/offer";
import { offerKeys } from "../../hooks/query/offerKeys";
import { queryClient } from "../../queryClient";

export function getOffer(id: string) {
  return queryClient.getQueryData<BuyOffer | SellOffer>(offerKeys.detail(id));
}
