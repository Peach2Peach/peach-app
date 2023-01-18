import { ColorValue } from 'react-native'
import { IconType } from '../../../assets/icons'
import tw from '../../../styles/tailwind'
import { wonDisputeForTrade } from './wonDisputeForTrade'

export const getDisputeResultTheme = (
  trade: ContractSummary,
): {
  icon: IconType
  level: SummaryItemLevel
  color: ColorValue | undefined
} => {
  if (wonDisputeForTrade(trade)) {
    if (trade.type === 'bid') return { icon: 'buy', level: 'SUCCESS', color: tw`text-success-main`.color }
    return { icon: 'sell', level: 'APP', color: tw`text-primary-main`.color }
  }
  return {
    icon: 'alertOctagon',
    level: 'WARN',
    color: tw`text-warning-main`.color,
  }
}
