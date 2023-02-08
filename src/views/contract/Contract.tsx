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
import { getNavigationDestinationForContract, getNavigationDestinationForOffer } from '../yourTrades/utils'
import { useNavigation } from '../../hooks'

export default (): ReactElement => {
  const { contract, isLoading, view, requiredAction, actionPending, postConfirmPaymentBuyer, postConfirmPaymentSeller }
    = useContractSetup()
  const navigation = useNavigation()
  if (!contract || !view || isLoading) return <LoadingScreen />

  const displayDate = new Date(contract.lastModified).toLocaleDateString('en-GB')
    .split('/')
    .join(' / ')

  // todo!
  const hasNewOffer = contract.tradeStatus === 'tradeCanceled'

  const goToNewOffer = () => {
    // todo!
    const isOfferItem = true
    let navigationDestination
    if (isOfferItem) {
      navigationDestination = getNavigationDestinationForOffer({ tradeStatus: 'TODO', id: 'TODO' })
    } else {
      navigationDestination = getNavigationDestinationForContract({ tradeStatus: 'TODO', id: 'TODO' })
    }
    navigation.navigate(navigationDestination)
  }

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
                <Text style={tw`text-center tooltip text-black-2 underline`}>{i18n('contract.goToNewOffer')}</Text>
                <Icon id="externalLink" style={tw`w-4 h-4 ml-1`} color={tw`text-primary-main`.color} />
              </TouchableOpacity>
            )}
          </>
        )}
        <View style={tw`flex-shrink max-h-full mt-8`}>
          <ChatButton contract={contract} style={tw`absolute right-0 z-10 -mr-4 top-4`} />
          <TradeSummary style={tw`max-h-full`} {...{ contract, view }} />
        </View>
      </View>
      <View style={tw`flex items-center w-full mt-12`}>
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
