import { isTradeCanceled, isTradeComplete } from '../../utils/contract/status'
import { ClosedTrade } from './ClosedTrade'
import { OpenTrade } from './OpenTrade'

export type TradeSummaryProps = ComponentProps & {
  contract: Contract
  view?: ContractViewer
}

export const TradeSummary = ({ contract, view, style }: TradeSummaryProps) => (
  <>
    {!isTradeComplete(contract) && !isTradeCanceled(contract) ? (
      <OpenTrade {...{ contract, view }} />
    ) : (
      <ClosedTrade {...{ contract, view }} />
    )}
  </>
)
