import { ColorValue } from 'react-native'
import { IconType } from '../../../assets/icons'
import { statusCardStyles } from '../../../components/statusCard/StatusCard'
import tw from '../../../styles/tailwind'
import { wonDisputeForTrade } from './wonDisputeForTrade'

export const getDisputeResultTheme = (
  trade: Pick<ContractSummary, 'disputeWinner' | 'type'>,
): {
  icon: IconType
  level: keyof typeof statusCardStyles.bg
  color: ColorValue | undefined
} => {
  const isWonDispute = wonDisputeForTrade(trade)
  return {
    icon: 'alertOctagon',
    level: isWonDispute ? 'green' : 'red',
    color: isWonDispute ? tw`text-success-main`.color : tw`text-error-main`.color,
  }
}
