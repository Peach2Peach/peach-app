import { IconType } from '../../../assets/icons'
import { statusCardStyles } from '../../../components/statusCard/StatusCard'
import { getDisputeResultTheme } from './getDisputeResultTheme'
import { getOfferColor } from './getOfferColor'
import { isContractSummary } from './isContractSummary'

export type TradeTheme = {
  iconId: IconType
  color: keyof typeof statusCardStyles.bg
}

export const getThemeForTradeItem = (trade: TradeSummary): TradeTheme => {
  const color = getOfferColor(trade)

  if (isContractSummary(trade)) {
    if (trade.disputeWinner) return getDisputeResultTheme(trade)
    if (trade.tradeStatus !== 'tradeCanceled') {
      if (trade.type === 'ask') return { iconId: 'sell', color }
      if (trade.type === 'bid') return { iconId: 'buy', color }
    }
  }

  return {
    iconId: 'xCircle',
    color,
  }
}
