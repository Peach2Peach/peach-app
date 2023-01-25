import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { PeachScrollView, Text, TradeSummary } from '../../components'
import { ChatButton } from '../../components/chat/ChatButton'
import LoadingScreen from '../loading/LoadingScreen'
import ContractCTA from './components/ContractCTA'
import { ContractStatusInfo } from './components/ContractStatusInfo'
import { useContractSetup } from './hooks/useContractSetup'

export default (): ReactElement => {
  const { contract, updatePending, view, requiredAction, loading, postConfirmPaymentBuyer, postConfirmPaymentSeller }
    = useContractSetup()

  if (!contract || updatePending || contract.canceled || contract.paymentConfirmed) return <LoadingScreen />

  return (
    <PeachScrollView contentContainerStyle={tw`justify-center flex-grow px-8 pb-6`}>
      <View>
        <Text style={tw`text-center`}>{'info placeholder'}</Text>
        <View style={tw`mt-8`}>
          <ChatButton contract={contract} style={tw`absolute right-0 z-10 -mr-4 top-4`} />
          <TradeSummary {...{ contract, view }} />
        </View>
      </View>
      <View style={tw`w-full flex items-center mt-12`}>
        <ContractStatusInfo {...{ contract, requiredAction, view }} />
        <ContractCTA
          style={tw`mt-3`}
          {...{ view, requiredAction, loading, postConfirmPaymentBuyer, postConfirmPaymentSeller }}
        />
      </View>
    </PeachScrollView>
  )
}
