import { isPastOffer } from './isPastOffer'
import { ColorValue } from 'react-native'
import { IconType } from '../../../assets/icons'
import tw from '../../../styles/tailwind'
import { getOfferLevel } from './getOfferLevel'
import { isContractSummary } from './isContractSummary'

const getDisputeResult = (
  youWon: boolean,
  tradeType: 'bid' | 'ask',
): {
  icon: IconType
  level: SummaryItemLevel
  color: ColorValue | undefined
} => {
  if (youWon) {
    if (tradeType === 'bid') {
      return { icon: 'buy', level: 'SUCCESS', color: tw`text-success-main`.color }
    }
    return { icon: 'sell', level: 'APP', color: tw`text-primary-main`.color }
  }
  return {
    icon: 'alertOctagon',
    level: 'WARN',
    color: tw`text-warning-main`.color,
  }
}

export const getThemeForPastTrade = (
  trade: ContractSummary | OfferSummary,
): { icon: IconType; level: SummaryItemLevel; color: ColorValue | undefined } => {
  const level = getOfferLevel(trade)

  if (!isPastOffer) {
    return { level, icon: 'x' as IconType, color: '' }
  }

  if (isContractSummary(trade)) {
    if (trade.disputeWinner) {
      const youWon
        = (trade.disputeWinner === 'seller' && trade.type === 'ask')
        || (trade.disputeWinner === 'buyer' && trade.type === 'bid')
      return getDisputeResult(youWon, trade.type)
    }
    if (trade.tradeStatus === 'tradeCanceled') {
      return {
        icon: 'xCircle',
        level,
        color: tw`text-black-2`.color,
      }
    }
    if (trade.type === 'ask') return { icon: 'sell', level: 'APP', color: tw`text-primary-main`.color }
    if (trade.type === 'bid') return { icon: 'buy', level: 'SUCCESS', color: tw`text-success-main`.color }
  }

  return {
    icon: 'xCircle',
    level,
    color: tw`text-black-2`.color,
  }
}
