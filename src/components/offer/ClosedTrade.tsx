import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import Icon from '../Icon'
import { Text } from '../text'
import { CanceledTradeDetails } from './CanceledTradeDetails'
import { CompletedTradeDetails } from './CompletedTradeDetails'
import { TradeSeparator } from './TradeSeparator'
import { TradeStuff } from './TradeStuff'
import { TradeSummaryProps } from './TradeSummary'

const DisputeOutcome = ({ isWinner }: { isWinner: boolean }) => (
  <View style={tw`flex-row`}>
    <Text style={tw`text-black-2 w-25`}>outcome</Text>
    <Icon id={isWinner ? 'check' : 'x'} style={tw`w-5 h-5 mr-2`} />
  </View>
)

const DisputeStatusInfo = ({ contract, view }: TradeSummaryProps) => {
  const isWinner = contract.disputeWinner === view
  return (
    <View style={tw`flex-row`}>
      <Text style={tw`text-black-2 w-25`}>status</Text>
      <DisputeOutcome isWinner={isWinner} />
    </View>
  )
}

const getTradeSeparatorIcon = (tradeStatus: TradeStatus) => {
  if (tradeStatus === 'tradeCanceled') {
    return 'xCircle'
  }
  return 'calendar'
}

export const ClosedTrade = ({ contract, view }: TradeSummaryProps) => (
  <>
    <TradeSeparator
      style={tw`mt-4`}
      {...contract}
      iconId={getTradeSeparatorIcon(contract.tradeStatus)}
      text={i18n(contract.tradeStatus === 'tradeCanceled' ? 'contract.tradeCanceled' : 'contract.tradeCompleted')}
    />
    {contract.tradeStatus === 'tradeCanceled' ? (
      <CanceledTradeDetails {...contract} style={tw`self-center`} />
    ) : (
      <CompletedTradeDetails {...contract} isBuyer={view === 'buyer'} />
    )}

    <TradeStuff contract={contract} style={tw`justify-start mt-4`} />
  </>
)
