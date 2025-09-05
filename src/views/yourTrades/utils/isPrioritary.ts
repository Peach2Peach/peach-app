const prioritaryStatus: TradeStatus[] = [
  "releaseEscrow",
  "confirmCancelation",
  "refundAddressRequired",
  "refundTxSignatureRequired",
  "refundOrReviveRequired",
];

export const isPrioritary = (tradeStatus: TradeStatus, type?: Offer["type"]) =>
  prioritaryStatus.includes(tradeStatus) ||
  (tradeStatus === "wrongAmountFundedOnContractRefundWaiting" &&
    type === "ask");
