const errorStatus = ["refundAddressRequired", "dispute"];

export const isError = (tradeStatus: TradeStatus) =>
  errorStatus.includes(tradeStatus);
