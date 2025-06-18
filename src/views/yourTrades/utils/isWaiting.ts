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
  if (type === "ask") {
    return (
      waitingStatus.includes(tradeStatus) ||
      waitingSellStatus.includes(tradeStatus)
    );
  }
  return (
    waitingStatus.includes(tradeStatus) ||
    waitingBuyStatus.includes(tradeStatus)
  );
};
