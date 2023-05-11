import { View } from 'react-native'
import { PeachScrollView } from '../../components'
import { TradeSummary } from '../../components/offer'
import tw from '../../styles/tailwind'

import LoadingScreen from '../loading/LoadingScreen'
import { useContractSetup } from './hooks/useContractSetup'
import { ContractActions } from './ContractActions'

export default () => {
  const { contract, isLoading, view, ...contractActionsProps } = useContractSetup()

  if (!contract || !view || isLoading) return <LoadingScreen />

  return (
    <PeachScrollView contentContainerStyle={tw`h-full px-6 pt-5`}>
      <View style={tw`h-full`}>
        <TradeSummary {...{ contract, view }} />
        <ContractActions
          style={tw`items-center justify-end flex-grow w-full mb-2`}
          {...{ contract, view, ...contractActionsProps }}
        />
      </View>
    </PeachScrollView>
  )
}
