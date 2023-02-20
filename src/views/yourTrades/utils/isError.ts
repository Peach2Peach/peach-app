const errorStatus = ['refundAddressRequired']

export const isError = (tradeStatus: TradeStatus) => errorStatus.includes(tradeStatus)
