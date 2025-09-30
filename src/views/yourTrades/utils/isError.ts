const errorStatus = [
  "refundAddressRequired",
  "dispute",
  "disputeWithoutEscrowFunded",
];

export const isError = (tradeStatus: TradeStatus) =>
  errorStatus.includes(tradeStatus);
