import tw from '../../../styles/tailwind'
import { isContractSummary } from './isContractSummary'

export const getThemeForPastTrade = (trade: ContractSummary | OfferSummary) => {
  if (isContractSummary(trade)) {
    if (
      (!!trade.disputeWinner && trade.disputeWinner === 'seller' && trade.type === 'bid')
      || (trade.disputeWinner === 'buyer' && trade.type === 'ask')
    ) {
      return {
        icon: 'alertOctagon',
        level: 'WARN',
        color: tw`bg-warning-main`.color,
      }
    }
    if (trade.tradeStatus === 'tradeCompleted' && trade.type === 'ask') {
      return { icon: 'sell', level: 'APP', color: tw`bg-primary-main`.color }
    }
    if (trade.tradeStatus === 'tradeCanceled') {
      return {
        icon: 'xCircle',
        level: 'DEFAULT',
        color: tw`bg-black-2`.color,
      }
    }
  }
  if (trade.tradeStatus === 'offerCanceled') {
    return {
      icon: 'xCircle',
      level: 'DEFAULT',
      color: tw`bg-black-2`.color,
    }
  }
  return {
    icon: 'buy',
    level: 'SUCCESS',
    color: tw`bg-success-background`.color,
  }
}
