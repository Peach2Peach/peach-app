import { View } from 'react-native'
import { PeachScrollView } from '../../components'
import { TradeSummary } from '../../components/offer'
import tw from '../../styles/tailwind'

import { LoadingScreen } from '../loading/LoadingScreen'
import { ContractActions } from './ContractActions'
import { ContractContext } from './context'
import { useContractSetup } from './hooks/useContractSetup'

export const Contract = () => {
  const { contract, isLoading, view, ...contractActionsProps } = useContractSetup()

  if (!contract || !view || isLoading) return <LoadingScreen />

  return (
    <PeachScrollView contentContainerStyle={[tw`h-full px-4 pt-5`, tw.md`px-6`]}>
      <View style={tw`h-full`}>
        <ContractContext.Provider value={{ contract, view }}>
          <TradeSummary />
          <ContractActions style={tw`items-center justify-end flex-grow w-full mb-2`} {...contractActionsProps} />
        </ContractContext.Provider>
      </View>
    </PeachScrollView>
  )
}
