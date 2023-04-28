import tw from '../../styles/tailwind'
import { CanceledTradeDetails } from './CanceledTradeDetails'
import { CompletedTradeDetails } from './CompletedTradeDetails'
import { DisputeStatus } from './DisputeStatus'
import { getTradeSeparatorIcon } from './getTradeSeparatorIcon'
import { getTradeSeparatorIconColor } from './getTradeSeparatorIconColor'
import { getTradeSeparatorText } from './getTradeSeparatorText'
import { shouldShowDisputeStatus } from './shouldShowDisputeStatus'
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
    {shouldShowDisputeStatus(contract) ? (
      <DisputeStatus winner={contract.disputeWinner} view={view} />
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
