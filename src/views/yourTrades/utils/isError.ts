import { TradeStatus } from "../../../../peach-api/src/@types/offer";

const errorStatus = ["refundAddressRequired", "dispute"];

export const isError = (tradeStatus: TradeStatus) =>
  errorStatus.includes(tradeStatus);
