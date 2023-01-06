import tw from '../../../styles/tailwind'
import { isContractSummary } from './isContractSummary'

export const getThemeForPastTrade = (trade: ContractSummary | OfferSummary) => {
  if (isContractSummary(trade)) {
    if (trade.disputeWinner) {
      return {
        icon: 'alertOctagon',
        level: 'WARN',
        color: tw`bg-warning-main`.color,
      }
    }
    if (trade.tradeStatus === 'tradeCanceled') {
      return {
        icon: 'xCircle',
        level: 'DEFAULT',
        color: tw`bg-black-2`.color,
      }
    }
    if (trade.type === 'ask') {
      return { icon: 'sell', level: 'APP', color: tw`bg-primary-main`.color }
    }
    if (trade.type === 'bid') {
      return { icon: 'buy', level: 'SUCCESS', color: tw`bg-success-main`.color }
    }
  }

  return {
    icon: 'xCircle',
    level: 'DEFAULT',
    color: tw`bg-black-2`.color,
  }
}
