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
  const isWonDispute = wonDisputeForTrade(trade)
  return {
    icon: 'alertOctagon',
    level: isWonDispute ? 'SUCCESS' : 'ERROR',
    color: isWonDispute ? tw`text-success-main`.color : tw`text-error-main`.color,
  }
}
