import { ColorValue } from 'react-native'
import { IconType } from '../../../assets/icons'
import tw from '../../../styles/tailwind'
import { getDisputeResultTheme } from './getDisputeResultTheme'
import { getOfferLevel } from './getOfferLevel'
import { isContractSummary } from './isContractSummary'

export type TradeTheme = {
  icon: IconType
  level: SummaryItemLevel
  color: ColorValue | undefined
}

export const getThemeForTradeItem = (trade: ContractSummary | OfferSummary): TradeTheme => {
  const level = getOfferLevel(trade)

  if (isContractSummary(trade)) {
    if (trade.disputeWinner) return getDisputeResultTheme(trade)
    if (trade.tradeStatus === 'tradeCanceled') return {
      icon: 'xCircle',
      level,
      color: tw.color('black-5'),
    }

    if (trade.type === 'ask') return { icon: 'sell', level, color: tw.color('primary-mild-2') }
    if (trade.type === 'bid') return { icon: 'buy', level, color: tw.color('success-mild') }
  }

  return {
    icon: 'xCircle',
    level,
    color: tw.color('black-5'),
  }
}
