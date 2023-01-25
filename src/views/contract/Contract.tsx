import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Icon, PeachScrollView, Text, TradeSummary } from '../../components'
import { ChatButton } from '../../components/chat/ChatButton'
import LoadingScreen from '../loading/LoadingScreen'
import ContractCTA from './components/ContractCTA'
import { ContractStatusInfo } from './components/ContractStatusInfo'
import { useContractSetup } from './hooks/useContractSetup'
import i18n from '../../utils/i18n'

export default (): ReactElement => {
  const { contract, isLoading, view, requiredAction, actionPending, postConfirmPaymentBuyer, postConfirmPaymentSeller }
    = useContractSetup()

  if (!contract || isLoading || contract.canceled || contract.paymentConfirmed) return <LoadingScreen />

  return (
    <PeachScrollView contentContainerStyle={tw`justify-center flex-grow px-8 pb-6`}>
      <View>
        {contract.disputeActive && (
          <View style={tw`flex-row items-center justify-center`}>
            <Text style={tw`subtitle-1 text-center`}>{i18n('contract.disputeActive')}</Text>
            <Icon id="alertOctagon" style={tw`w-6 h-6 ml-1 -mt-0.5`} color={tw`text-warning-main`.color} />
          </View>
        )}
        <View style={tw`mt-8`}>
          <ChatButton contract={contract} style={tw`absolute right-0 z-10 -mr-4 top-4`} />
          <TradeSummary {...{ contract, view }} />
        </View>
      </View>
      <View style={tw`w-full flex items-center mt-12`}>
        <ContractStatusInfo {...{ contract, requiredAction, view }} />
        <ContractCTA
          style={tw`mt-3`}
          {...{ view, requiredAction, actionPending, postConfirmPaymentBuyer, postConfirmPaymentSeller }}
        />
      </View>
    </PeachScrollView>
  )
}
