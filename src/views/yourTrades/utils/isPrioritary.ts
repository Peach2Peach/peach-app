import { TradeStatus } from "../../../../peach-api/src/@types/offer";

const prioritaryStatus: TradeStatus[] = [
  "releaseEscrow",
  "confirmCancelation",
  "refundAddressRequired",
  "refundTxSignatureRequired",
  "refundOrReviveRequired",
];

export const isPrioritary = (tradeStatus: TradeStatus) =>
  prioritaryStatus.includes(tradeStatus);
