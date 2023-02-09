import React, { ReactElement } from 'react'
import { TouchableOpacity, View } from 'react-native'
import tw from '../../styles/tailwind'

import { Icon, Text, TradeSummary } from '../../components'
import { ChatButton } from '../../components/chat/ChatButton'
import i18n from '../../utils/i18n'
import LoadingScreen from '../loading/LoadingScreen'
import ContractCTA from './components/ContractCTA'
import { ContractStatusInfo } from './components/ContractStatusInfo'
import { useContractSetup } from './hooks/useContractSetup'

export default (): ReactElement => {
  const {
    contract,
    isLoading,
    view,
    requiredAction,
    actionPending,
    postConfirmPaymentBuyer,
    postConfirmPaymentSeller,
    hasNewOffer,
    goToNewOffer,
  } = useContractSetup()
  if (!contract || !view || isLoading) return <LoadingScreen />

  const displayDate = new Date(contract.lastModified).toLocaleDateString('en-GB')
    .split('/')
    .join(' / ')

  return (
    <View style={tw`justify-between flex-shrink h-full px-8 pb-6`}>
      <View style={tw`justify-center flex-shrink h-full`}>
        {contract.disputeActive && (
          <View style={tw`flex-row items-center justify-center`}>
            <Text style={tw`text-center subtitle-1`}>{i18n('contract.disputeActive')}</Text>
            <Icon id="alertOctagon" style={tw`w-6 h-6 ml-1 -mt-0.5`} color={tw`text-warning-main`.color} />
          </View>
        )}
        {contract.tradeStatus === 'tradeCompleted' && (
          <View style={tw`flex-row items-center justify-center`}>
            <Text style={tw`text-center subtitle-1`}>
              {i18n('contract.tradeCompleted')} {displayDate}
            </Text>
            <Icon id="calendar" style={tw`w-6 h-6 ml-2`} color={tw`text-black-3`.color} />
          </View>
        )}
        {contract.tradeStatus === 'tradeCanceled' && (
          <>
            <View style={tw`flex-row items-center justify-center`}>
              <Text style={tw`text-center subtitle-1`}>
                {i18n('contract.tradeCanceled')} {displayDate}
              </Text>
              <Icon id="xCircle" style={tw`w-6 h-6 ml-2`} color={tw`text-black-3`.color} />
            </View>
            {hasNewOffer && (
              <TouchableOpacity style={tw`flex-row items-center justify-center mt-2`} onPress={goToNewOffer}>
                <Text style={tw`text-center underline tooltip text-black-2`}>{i18n('contract.goToNewOffer')}</Text>
                <Icon id="externalLink" style={tw`w-4 h-4 ml-1`} color={tw`text-primary-main`.color} />
              </TouchableOpacity>
            )}
          </>
        )}
        <TradeSummary style={tw`flex-shrink max-h-full mt-8`} {...{ contract, view }} />
      </View>
      <View style={tw`flex items-center w-full mt-12`}>
        <ContractStatusInfo {...{ contract, requiredAction, view }} />
        <View style={[tw`items-center w-full mt-3`]}>
          <ContractCTA
            {...{ contract, view, requiredAction, actionPending, postConfirmPaymentBuyer, postConfirmPaymentSeller }}
          />
        </View>
      </View>
    </View>
  )
}
