export const getTradeSeparatorIcon = (tradeStatus: TradeStatus) => {
  if (tradeStatus === 'tradeCompleted') {
    return undefined
  }
  if (tradeStatus === 'tradeCanceled') {
    return 'xCircle'
  }
  if (tradeStatus === 'refundOrReviveRequired') {
    return 'alertOctagon'
  }
  return undefined
}
