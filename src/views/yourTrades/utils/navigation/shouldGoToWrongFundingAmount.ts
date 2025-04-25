import { TradeStatus } from "../../../../../peach-api/src/@types/offer";

export const shouldGoToWrongFundingAmount = (status: TradeStatus) =>
  status === "fundingAmountDifferent";
