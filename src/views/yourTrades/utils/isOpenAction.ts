const openActionStatus = [
  "fundEscrow",
  "fundingAmountDifferent",
  "hasMatchesAvailable",
  "offerHiddenWithMatchesAvailable",
  "rateUser",
];
const sellOpenActionStatus = ["confirmPaymentRequired", "paymentTooLate"];
const buyOpenActionStatus = ["paymentRequired", "fundingExpired"];

export const isOpenAction = (type: Offer["type"], tradeStatus: TradeStatus) =>
  openActionStatus.includes(tradeStatus) ||
  (sellOpenActionStatus.includes(tradeStatus) && type === "ask") ||
  (buyOpenActionStatus.includes(tradeStatus) && type === "bid");
