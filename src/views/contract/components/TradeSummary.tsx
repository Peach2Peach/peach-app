import { View } from 'react-native'
import { MatchCardCounterparty } from '../../../components/matches/components'
import tw from '../../../styles/tailwind'
import { useContractContext } from '../context'
import { PendingPayoutInfo } from './PendingPayoutInfo'
import { TradeInformation } from './TradeInformation'
import { TradeStuff } from './TradeStuff'

export const TradeSummary = () => {
  const { contract, view, showBatchInfo } = useContractContext()

  if (showBatchInfo) return <PendingPayoutInfo />

  return (
    <View style={[tw`gap-4`, tw.md`gap-8`]}>
      <MatchCardCounterparty
        user={view === 'buyer' ? contract.seller : contract.buyer}
        isDispute={contract.disputeActive}
      />
      <TradeInformation />
      <TradeStuff />
    </View>
  )
}
