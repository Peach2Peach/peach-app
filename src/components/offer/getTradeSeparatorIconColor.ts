import tw from '../../styles/tailwind'

export const getTradeSeparatorIconColor = (tradeStatus: TradeStatus) => {
  if (tradeStatus === 'refundOrReviveRequired') {
    return tw`text-black-2`.color
  }
  return undefined
}
