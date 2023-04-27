import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { CanceledTradeDetails } from './CanceledTradeDetails'
import { CompletedTradeDetails } from './CompletedTradeDetails'
import { TradeSeparator } from './TradeSeparator'
import { TradeStuff } from './TradeStuff'
import { TradeSummaryProps } from './TradeSummary'

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
