import { TradeStatus } from "../../../../peach-api/src/@types/offer";

const pastOfferStatus = ["tradeCompleted", "tradeCanceled", "offerCanceled"];

export const isPastOffer = (tradeStatus: TradeStatus) =>
  pastOfferStatus.includes(tradeStatus);
