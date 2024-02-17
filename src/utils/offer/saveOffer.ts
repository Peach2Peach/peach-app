import { offerKeys } from "../../hooks/query/useOfferDetail";
import { queryClient } from "../../queryClient";
import { useTradeSummaryStore } from "../../store/tradeSummaryStore";
import { getSummaryFromOffer } from "./getSummaryFromOffer";

export const saveOffer = (offer: SellOffer | BuyOffer) => {
  queryClient.setQueryData(offerKeys.detail(offer.id), offer);
  useTradeSummaryStore
    .getState()
    .setOffer(offer.id, getSummaryFromOffer(offer));
};
