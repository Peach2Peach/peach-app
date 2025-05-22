import { TradeRequest } from "../../../peach-api/src/@types/contract";
import { BuyOffer, SellOffer } from "../../../peach-api/src/@types/offer";
import { offerKeys, tradeRequestKeys } from "../../hooks/query/offerKeys";
import { queryClient } from "../../queryClient";

export function getOffer(id: string) {
  return queryClient.getQueryData<BuyOffer | SellOffer>(offerKeys.detail(id));
}

export function getTradeRequest(offerId: string, requestingUserId: string) {
  return queryClient.getQueryData<TradeRequest>(
    tradeRequestKeys.detail(offerId, requestingUserId),
  );
}
