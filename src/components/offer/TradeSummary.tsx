import { isTradeCanceled, isTradeComplete } from '../../utils/contract/status'
import { ClosedTrade } from './ClosedTrade'
import { OpenTrade } from './OpenTrade'

export type TradeSummaryProps = {
  contract: Contract
  view: ContractViewer | undefined
}

export const TradeSummary = (props: TradeSummaryProps) =>
  !isTradeComplete(props.contract) && !isTradeCanceled(props.contract) ? (
    <OpenTrade {...props} />
  ) : (
    <ClosedTrade {...props} />
  )
