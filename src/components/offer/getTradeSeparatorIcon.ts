export const getTradeSeparatorIcon = (tradeStatus: TradeStatus) => {
  if (tradeStatus === 'tradeCanceled') {
    return 'xCircle'
  }
  if (tradeStatus === 'refundOrReviveRequired') {
    return 'alertOctagon'
  }
  return 'calendar'
}
