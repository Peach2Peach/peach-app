import tw from '../../../styles/tailwind'
import { getOfferLevel } from './getOfferLevel'
import { isContractSummary } from './isContractSummary'

export const getThemeForPastTrade = (trade: ContractSummary | OfferSummary) => {
  const level = getOfferLevel(trade)

  if (isContractSummary(trade)) {
    if (trade.disputeWinner) return {
      icon: 'alertOctagon',
      level,
      color: tw`bg-warning-main`.color,
    }
    if (trade.tradeStatus === 'tradeCanceled') {
      return {
        icon: 'xCircle',
        level,
        color: tw`bg-black-2`.color,
      }
    }
    if (trade.type === 'ask') return { icon: 'sell', level, color: tw`bg-primary-main`.color }
    if (trade.type === 'bid') return { icon: 'buy', level, color: tw`bg-success-main`.color }
  }

  return {
    icon: 'xCircle',
    level,
    color: tw`bg-black-2`.color,
  }
}
