import { ClosedTrade } from './ClosedTrade'
import { shouldShowOpenTrade } from './shouldShowOpenTrade'
import { OpenTrade } from './OpenTrade'
import { MatchCardCounterparty } from '../matches/components'

export type TradeSummaryProps = {
  contract: Contract
  view: ContractViewer
}

export const TradeSummary = ({ contract, view }: TradeSummaryProps) => (
  <>
    <MatchCardCounterparty
      user={view === 'buyer' ? contract.seller : contract.buyer}
      isDispute={contract.disputeActive}
    />
    {shouldShowOpenTrade(contract) ? <OpenTrade {...{ contract, view }} /> : <ClosedTrade {...{ contract, view }} />}
  </>
)
