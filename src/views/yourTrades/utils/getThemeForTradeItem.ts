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
    if (trade.tradeStatus === 'paymentTooLate') return { iconId: 'watch', color }
    if (trade.tradeStatus !== 'tradeCanceled') {
      return {
        iconId: trade.type === 'ask' ? 'sell' : 'buy',
        color,
      }
    }
  }

  return {
    iconId: 'xCircle',
    color,
  }
}
