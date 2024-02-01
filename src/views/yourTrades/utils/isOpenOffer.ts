import { isPastOffer } from "./isPastOffer";

export const isOpenOffer = (tradeStatus: TradeStatus) =>
  !isPastOffer(tradeStatus);
