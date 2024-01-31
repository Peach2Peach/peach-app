export const shouldGoToWrongFundingAmount = (status: TradeStatus) =>
  status === "fundingAmountDifferent";
