import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { Icon, Text, TradeSummary } from '../../components'
import { ChatButton } from '../../components/chat/ChatButton'
import i18n from '../../utils/i18n'
import LoadingScreen from '../loading/LoadingScreen'
import ContractCTA from './components/ContractCTA'
import { ContractStatusInfo } from './components/ContractStatusInfo'
import { useContractSetup } from './hooks/useContractSetup'

export default (): ReactElement => {
  const { contract, isLoading, view, requiredAction, actionPending, postConfirmPaymentBuyer, postConfirmPaymentSeller }
    = useContractSetup()

  if (!contract || !view || isLoading || contract.canceled || contract.paymentConfirmed) return <LoadingScreen />

  return (
    <View style={tw`justify-between  h-full flex-shrink px-8 pb-6`}>
      <View style={tw`justify-center h-full flex-shrink`}>
        {contract.disputeActive && (
          <View style={tw`flex-row items-center justify-center`}>
            <Text style={tw`subtitle-1 text-center`}>{i18n('contract.disputeActive')}</Text>
            <Icon id="alertOctagon" style={tw`w-6 h-6 ml-1 -mt-0.5`} color={tw`text-warning-main`.color} />
          </View>
        )}
        <View style={tw`mt-8 max-h-full flex-shrink`}>
          <ChatButton contract={contract} style={tw`absolute right-0 z-10 -mr-4 top-4`} />
          <TradeSummary style={tw`max-h-full`} {...{ contract, view }} />
        </View>
      </View>
      <View style={tw`w-full flex items-center mt-12`}>
        <ContractStatusInfo {...{ contract, requiredAction, view }} />
        <View style={[tw`w-full items-center mt-3`]}>
          <ContractCTA
            {...{ contract, view, requiredAction, actionPending, postConfirmPaymentBuyer, postConfirmPaymentSeller }}
          />
        </View>
      </View>
    </View>
  )
}
