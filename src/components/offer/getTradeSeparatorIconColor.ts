import tw from '../../styles/tailwind'

export const getTradeSeparatorIconColor = (tradeStatus: TradeStatus) => {
  if (tradeStatus === 'refundOrReviveRequired') {
    return tw.color('black-2')
  }
  return undefined
}
