import { TradeStatus } from "../../../../peach-api/src/@types/offer";

const waitingStatus = [
  "escrowWaitingForConfirmation",
  "searchingForPeer",
  "offerHidden",
  "payoutPending",
];
const waitingBuyStatus = ["confirmPaymentRequired", "paymentTooLate"];
const waitingSellStatus = ["paymentRequired", "fundingExpired"];
export const isWaiting = (type: "ask" | "bid", tradeStatus: TradeStatus) =>
  waitingStatus.includes(tradeStatus) ||
  (waitingSellStatus.includes(tradeStatus) && type === "ask") ||
  (waitingBuyStatus.includes(tradeStatus) && type === "bid");
