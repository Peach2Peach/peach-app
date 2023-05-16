import { MatchCardCounterparty } from '../matches/components'
import tw from '../../styles/tailwind'
import { View } from 'react-native'
import { TradeStuff } from './TradeStuff'
import { TradeInformation } from './TradeInformation'
import { useContractContext } from '../../views/contract/context'

export const TradeSummary = () => {
  const { contract, view } = useContractContext()
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
