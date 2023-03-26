import { ReactElement } from 'react';
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import { TradeSummary } from '../../components'
import LoadingScreen from '../loading/LoadingScreen'
import ContractCTA from './components/ContractCTA'
import { ContractStatusInfo } from './components/ContractStatusInfo'
import { ContractSubtitle } from './components/ContractSubtitle'
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

  return (
    <View style={tw`justify-between flex-shrink h-full px-8 pb-6`}>
      <View style={tw`justify-center flex-shrink h-full`}>
        <ContractSubtitle {...{ contract, view, hasNewOffer, goToNewOffer }} />
        <TradeSummary style={tw`flex-shrink max-h-full mt-6`} {...{ contract, view }} />
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
