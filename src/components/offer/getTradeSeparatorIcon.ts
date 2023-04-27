export const getTradeSeparatorIcon = (tradeStatus: TradeStatus) => {
  if (tradeStatus === 'tradeCanceled') {
    return 'xCircle'
  }
  return 'calendar'
}
