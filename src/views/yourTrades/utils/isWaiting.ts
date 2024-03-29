const waitingStatus = [
  "escrowWaitingForConfirmation",
  "searchingForPeer",
  "offerHidden",
  "payoutPending",
];
const waitingBuyStatus = ["confirmPaymentRequired", "paymentTooLate"];
export const isWaiting = (type: Offer["type"], tradeStatus: TradeStatus) =>
  waitingStatus.includes(tradeStatus) ||
  (tradeStatus === "paymentRequired" && type === "ask") ||
  (waitingBuyStatus.includes(tradeStatus) && type === "bid");
