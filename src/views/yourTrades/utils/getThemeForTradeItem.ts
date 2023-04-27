import { ColorValue } from 'react-native'
import { IconType } from '../../../assets/icons'
import tw from '../../../styles/tailwind'
import { getDisputeResultTheme } from './getDisputeResultTheme'
import { getOfferLevel } from './getOfferLevel'
import { isContractSummary } from './isContractSummary'
import { isPastOffer } from './isPastOffer'

export const getThemeForTradeItem = (
  trade: ContractSummary | OfferSummary,
): { icon: IconType; level: SummaryItemLevel; color: ColorValue | undefined } => {
  const level = getOfferLevel(trade)

  if (!isPastOffer) {
    return { level, icon: 'x' as IconType, color: '' }
  }

  if (isContractSummary(trade)) {
    if (trade.disputeWinner) return getDisputeResultTheme(trade)
    if (trade.tradeStatus === 'tradeCanceled') return {
      icon: 'xCircle',
      level,
      color: tw`text-black-5`.color,
    }

    if (trade.type === 'ask') return { icon: 'sell', level, color: tw`text-primary-mild-2`.color }
    if (trade.type === 'bid') return { icon: 'buy', level, color: tw`text-success-mild`.color }
  }

  return {
    icon: 'xCircle',
    level,
    color: tw`text-black-5`.color,
  }
}
