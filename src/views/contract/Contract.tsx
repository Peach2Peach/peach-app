import { View } from 'react-native'
import { PeachScrollView } from '../../components'
import { MatchCardCounterparty } from '../../components/matches/components/MatchCardCounterparty'
import { TradeSummary } from '../../components/offer'
import tw from '../../styles/tailwind'

import LoadingScreen from '../loading/LoadingScreen'
import { ContractCTA } from './components/ContractCTA'
import { useContractSetup } from './hooks/useContractSetup'

export default () => {
  const { contract, isLoading, view, requiredAction, actionPending, postConfirmPaymentBuyer, postConfirmPaymentSeller }
    = useContractSetup()
  if (!contract || !view || isLoading) return <LoadingScreen />

  return (
    <PeachScrollView contentContainerStyle={tw`px-6 pt-5 h-full`}>
      <View style={tw`h-full`}>
        <MatchCardCounterparty user={contract.seller} isDispute={contract.disputeActive} />
        <TradeSummary {...{ contract, view }} />
        <View style={tw`items-center w-full flex-grow justify-end mb-2`}>
          <ContractCTA
            {...{ contract, view, requiredAction, actionPending, postConfirmPaymentBuyer, postConfirmPaymentSeller }}
          />
        </View>
      </View>
    </PeachScrollView>
  )
}
