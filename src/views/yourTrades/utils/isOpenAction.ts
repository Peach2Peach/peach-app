import { TradeStatus } from "../../../../peach-api/src/@types/offer";

const openActionStatus = [
  "createEscrow",
  "fundEscrow",
  "fundingAmountDifferent",
  "hasMatchesAvailable",
  "hasTradeRequests",
  "offerHiddenWithMatchesAvailable",
  "rateUser",
];
const sellOpenActionStatus = ["confirmPaymentRequired", "paymentTooLate"];
const buyOpenActionStatus = ["paymentRequired", "fundingExpired"];

export const isOpenAction = (type: "ask" | "bid", tradeStatus: TradeStatus) =>
  openActionStatus.includes(tradeStatus) ||
  (sellOpenActionStatus.includes(tradeStatus) && type === "ask") ||
  (buyOpenActionStatus.includes(tradeStatus) && type === "bid");
