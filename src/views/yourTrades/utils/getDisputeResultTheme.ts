import { ColorValue } from 'react-native'
import { IconType } from '../../../assets/icons'
import tw from '../../../styles/tailwind'
import { wonDisputeForTrade } from './wonDisputeForTrade'

export const getDisputeResultTheme = (
  trade: Pick<ContractSummary, 'disputeWinner' | 'type'>,
): {
  icon: IconType
  level: SummaryItemLevel
  color: ColorValue | undefined
} => {
  if (wonDisputeForTrade(trade)) {
    if (trade.type === 'bid') return { icon: 'buy', level: 'SUCCESS', color: tw`text-success-main`.color }
    return { icon: 'alertOctagon', level: 'SUCCESS', color: tw`text-primary-main`.color }
  }
  return {
    icon: 'alertOctagon',
    level: 'ERROR',
    color: tw`text-warning-main`.color,
  }
}
