import { ClosedTrade } from './ClosedTrade'
import { shouldShowOpenTrade } from './shouldShowOpenTrade'
import { OpenTrade } from './OpenTrade'

export type TradeSummaryProps = {
  contract: Contract
  view: ContractViewer
}

export const TradeSummary = (props: TradeSummaryProps) =>
  shouldShowOpenTrade(props.contract) ? <OpenTrade {...props} /> : <ClosedTrade {...props} />
