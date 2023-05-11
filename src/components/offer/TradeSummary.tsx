import { MatchCardCounterparty } from '../matches/components'
import tw from '../../styles/tailwind'
import { View } from 'react-native'
import { TradeStuff } from './TradeStuff'
import { TradeInformation } from './TradeInformation'

export type TradeSummaryProps = {
  contract: Contract
  view: ContractViewer
}

export const TradeSummary = ({ contract, view }: TradeSummaryProps) => (
  <View style={[tw`gap-4`, tw.md`gap-8`]}>
    <MatchCardCounterparty
      user={view === 'buyer' ? contract.seller : contract.buyer}
      isDispute={contract.disputeActive}
    />
    <TradeInformation {...{ contract, view }} />
    <TradeStuff contract={contract} />
  </View>
)
