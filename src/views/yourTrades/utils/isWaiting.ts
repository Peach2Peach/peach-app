const waitingStatus = [
  "escrowWaitingForConfirmation",
  "searchingForPeer",
  "offerHidden",
  "payoutPending",
];
const waitingBuyStatus = ["confirmPaymentRequired", "paymentTooLate"];
const waitingSellStatus = ["paymentRequired", "fundingExpired"];
export const isWaiting = (type: Offer["type"], tradeStatus: TradeStatus) =>
  waitingStatus.includes(tradeStatus) ||
  (waitingSellStatus.includes(tradeStatus) && type === "ask") ||
  (waitingBuyStatus.includes(tradeStatus) && type === "bid");
