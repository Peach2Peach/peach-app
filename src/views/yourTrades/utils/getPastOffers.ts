import { ContractSummary } from "../../../../peach-api/src/@types/contract";
import { OfferSummary } from "../../../../peach-api/src/@types/offer";
import { isPastOffer } from "./isPastOffer";

export const getPastOffers = (trades: (OfferSummary | ContractSummary)[]) =>
  trades.filter(
    (item) =>
      isPastOffer(item.tradeStatus, item.type) &&
      ((item.type === "ask" && "fundingTxId" in item && !!item?.fundingTxId) ||
        item.tradeStatus !== "offerCanceled"),
  );
