import { TradeStatus } from "../../../../peach-api/src/@types/offer";

const waitingStatus = [
  "escrowWaitingForConfirmation",
  "searchingForPeer",
  "offerHidden",
  "payoutPending",
];
const waitingBuyStatus = [
  "confirmPaymentRequired",
  "paymentTooLate",
  "waitingForFunding",
];
const waitingSellStatus = ["paymentRequired", "fundingExpired"];
export const isWaiting = (type: "ask" | "bid", tradeStatus: TradeStatus) => {
  if (waitingStatus.includes(tradeStatus)) {
    return true;
  }
  if (type === "ask") {
    return waitingSellStatus.includes(tradeStatus);
  }
  return waitingBuyStatus.includes(tradeStatus);
};
