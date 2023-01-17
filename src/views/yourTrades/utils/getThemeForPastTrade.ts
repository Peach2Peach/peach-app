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
    // DISPUTE LOST
    if (
      (trade.disputeWinner === 'seller' && trade.type === 'bid')
      || (trade.disputeWinner === 'buyer' && trade.type === 'ask')
    ) return {
      icon: 'alertOctagon',
      level: 'WARN',
      color: tw`text-warning-main`.color,
    }
    // DISPUTE WON AND YOU ARE THE BUYER
    if (trade.disputeWinner === 'buyer' && trade.type === 'bid') {
      return { icon: 'buy', level: 'SUCCESS', color: tw`text-success-main`.color }
    }
    // DISPUTE WON AND YOU ARE THE SELLER
    if (trade.disputeWinner === 'seller' && trade.type === 'ask') {
      return { icon: 'sell', level: 'APP', color: tw`text-primary-main`.color }
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
