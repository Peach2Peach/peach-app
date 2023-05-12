export const getTradeSeparatorIcon = (tradeStatus: TradeStatus) => {
  console.log('TradeStatus:', tradeStatus)
  if (tradeStatus === 'tradeCompleted') {
    return undefined
  }
  if (tradeStatus === 'tradeCanceled') {
    return 'xCircle'
  }
  if (tradeStatus === 'refundOrReviveRequired') {
    return 'alertOctagon'
  }
  return 'calendar'
}
