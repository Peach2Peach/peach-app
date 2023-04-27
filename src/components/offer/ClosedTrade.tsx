import { View } from 'react-native'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { Text } from '../text'
import { CanceledTradeDetails } from './CanceledTradeDetails'
import { CompletedTradeDetails } from './CompletedTradeDetails'
import { getTradeSeparatorIcon } from './getTradeSeparatorIcon'
import { getTradeSeparatorIconColor } from './getTradeSeparatorIconColor'
import { getTradeSeparatorText } from './getTradeSeparatorText'
import { TradeSeparator } from './TradeSeparator'
import { TradeStuff } from './TradeStuff'
import { TradeStuffSeparator } from './TradeStuffSeparator'
import { TradeSummaryProps } from './TradeSummary'

export const ClosedTrade = ({ contract, view }: TradeSummaryProps) => (
  <>
    <TradeSeparator
      style={tw`mt-4`}
      {...contract}
      iconId={getTradeSeparatorIcon(contract.tradeStatus)}
      iconColor={getTradeSeparatorIconColor(contract.tradeStatus)}
      text={getTradeSeparatorText(contract.tradeStatus)}
    />
    {contract.tradeStatus === 'refundOrReviveRequired' ? (
      <>
        <View style={tw`flex-row items-center my-2`}>
          <Text style={tw`text-black-3 w-18`}>status</Text>
          <Text style={tw`mx-2 subtitle-2`}>dispute won</Text>
          <Icon id="checkCircle" color={tw`text-success-main`.color} style={tw`w-4 h-4`} />
        </View>
        <Text style={tw`body-s`}>
          You won the dispute! The buyer's reputation has been impacted. You can now either re-publish the offer or get
          refunded.
        </Text>
      </>
    ) : (
      <>
        {contract.tradeStatus === 'tradeCanceled' ? (
          <CanceledTradeDetails {...contract} style={tw`self-center`} />
        ) : (
          <CompletedTradeDetails {...contract} isBuyer={view === 'buyer'} />
        )}
      </>
    )}

    <TradeStuffSeparator {...contract} style={tw`mt-4`} />
    <TradeStuff contract={contract} style={tw`justify-start mt-6px`} />
  </>
)
