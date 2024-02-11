import { offerKeys } from "../../hooks/query/useOfferDetail";
import { queryClient } from "../../queryClient";
import { useTradeSummaryStore } from "../../store/tradeSummaryStore";
import { error } from "../log/error";
import { info } from "../log/info";
import { getSummaryFromOffer } from "./getSummaryFromOffer";

export const saveOffer = (offer: SellOffer | BuyOffer) => {
  if (!offer.id) {
    error("saveOffer", "offer.id is undefined");
    return;
  }

  queryClient.setQueryData(offerKeys.detail(offer.id), offer);
  info("saveOffer", offer.id);
  useTradeSummaryStore
    .getState()
    .setOffer(offer.id, getSummaryFromOffer(offer));
};
