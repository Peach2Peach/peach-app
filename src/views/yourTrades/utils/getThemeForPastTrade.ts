import { ColorValue } from 'react-native'
import { IconType } from '../../../assets/icons'
import tw from '../../../styles/tailwind'
import { getOfferLevel } from './getOfferLevel'
import { isContractSummary } from './isContractSummary'

export const getThemeForPastTrade = (
  trade: ContractSummary | OfferSummary,
): { icon: IconType; level: SummaryItemLevel; color: ColorValue | undefined } => {
  const level = getOfferLevel(trade)

  if (isContractSummary(trade)) {
    if (trade.disputeWinner) return {
      icon: 'alertOctagon',
      level,
      color: tw`text-warning-main`.color,
    }
    if (trade.tradeStatus === 'tradeCanceled') {
      return {
        icon: 'xCircle',
        level,
        color: tw`text-black-2`.color,
      }
    }
    if (trade.type === 'ask') return { icon: 'sell', level, color: tw`text-primary-main`.color }
    if (trade.type === 'bid') return { icon: 'buy', level, color: tw`text-success-main`.color }
  }

  return {
    icon: 'xCircle',
    level,
    color: tw`text-black-2`.color,
  }
}
