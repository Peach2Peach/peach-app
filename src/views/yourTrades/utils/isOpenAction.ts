const openActionStatus = [
  "fundEscrow",
  "fundingAmountDifferent",
  "hasMatchesAvailable",
  "offerHiddenWithMatchesAvailable",
  "rateUser",
  "createEscrow",
  "acceptTradeRequest",
];
const sellOpenActionStatus = ["confirmPaymentRequired", "paymentTooLate"];

export const isOpenAction = (type: Offer["type"], tradeStatus: TradeStatus) =>
  openActionStatus.includes(tradeStatus) ||
  (sellOpenActionStatus.includes(tradeStatus) && type === "ask") ||
  (tradeStatus === "paymentRequired" && type === "bid");
