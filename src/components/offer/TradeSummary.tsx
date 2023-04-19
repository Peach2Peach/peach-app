import { isTradeCanceled, isTradeComplete } from '../../utils/contract/status'
import { ClosedTrade } from './ClosedTrade'
import { OpenTrade } from './OpenTrade'

export type TradeSummaryProps = {
  contract: Contract
  view: ContractViewer | undefined
}

export const TradeSummary = ({ contract, view }: TradeSummaryProps) => (
  <>
    {!isTradeComplete(contract) && !isTradeCanceled(contract) ? (
      <OpenTrade {...{ contract, view }} />
    ) : (
      <ClosedTrade {...{ contract, view }} />
    )}
  </>
)
