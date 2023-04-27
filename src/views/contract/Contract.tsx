import { View } from 'react-native'
import { PeachScrollView } from '../../components'
import { MatchCardCounterparty } from '../../components/matches/components/MatchCardCounterparty'
import { TradeSummary } from '../../components/offer'
import tw from '../../styles/tailwind'

import LoadingScreen from '../loading/LoadingScreen'
import { ContractCTA } from './components/ContractCTA'
import { useContractSetup } from './hooks/useContractSetup'
import { ProvideEmailButton } from './components/ProvideEmailButton'

export default () => {
  const { contract, isLoading, view, requiredAction, actionPending, postConfirmPaymentBuyer, postConfirmPaymentSeller }
    = useContractSetup()
  if (!contract || !view || isLoading) return <LoadingScreen />

  return (
    <PeachScrollView contentContainerStyle={tw`h-full px-6 pt-5`}>
      <View style={tw`h-full`}>
        <MatchCardCounterparty
          user={view === 'buyer' ? contract.seller : contract.buyer}
          isDispute={contract.disputeActive}
        />
        <TradeSummary {...{ contract, view }} />
        <View style={tw`items-center justify-end flex-grow w-full mb-2`}>
          {!!contract.isEmailRequired && <ProvideEmailButton {...{ contract, view }} style={tw`self-center mb-4`} />}
          <ContractCTA
            {...{ contract, view, requiredAction, actionPending, postConfirmPaymentBuyer, postConfirmPaymentSeller }}
          />
        </View>
      </View>
    </PeachScrollView>
  )
}
