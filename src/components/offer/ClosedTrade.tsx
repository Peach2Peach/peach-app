import tw from '../../styles/tailwind'
import { CanceledTradeDetails } from './CanceledTradeDetails'
import { CompletedTradeDetails } from './CompletedTradeDetails'
import { getTradeSeparatorIcon } from './getTradeSeparatorIcon'
import { getTradeSeparatorText } from './getTradeSeparatorText'
import { TradeSeparator } from './TradeSeparator'
import { TradeStuff } from './TradeStuff'
import { TradeSummaryProps } from './TradeSummary'

export const ClosedTrade = ({ contract, view }: TradeSummaryProps) => (
  <>
    <TradeSeparator
      style={tw`mt-4`}
      {...contract}
      iconId={getTradeSeparatorIcon(contract.tradeStatus)}
      text={getTradeSeparatorText(contract.tradeStatus)}
    />
    {contract.tradeStatus === 'tradeCanceled' ? (
      <CanceledTradeDetails {...contract} style={tw`self-center`} />
    ) : (
      <CompletedTradeDetails {...contract} isBuyer={view === 'buyer'} />
    )}

    <TradeStuff contract={contract} style={tw`justify-start mt-4`} />
  </>
)
