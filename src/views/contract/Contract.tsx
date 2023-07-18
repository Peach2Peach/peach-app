import { View } from 'react-native'
import { PeachScrollView } from '../../components'
import { TradeSummary } from '../../components/offer'
import tw from '../../styles/tailwind'

import LoadingScreen from '../loading/LoadingScreen'
import { ContractActions } from './ContractActions'
import { ContractContext } from './context'
import { useContractSetup } from './hooks/useContractSetup'

export default () => {
  const { contract, isLoading, view, ...contractActionsProps } = useContractSetup()

  if (!contract || !view || isLoading) return <LoadingScreen />

  return (
    <PeachScrollView style={[tw`h-full px-sm`, tw.md`px-md`]} contentContainerStyle={[tw`pt-sm`, tw.md`pt-md`]}>
      <View style={tw`h-full`}>
        <ContractContext.Provider value={{ contract, view }}>
          <TradeSummary />
          <ContractActions style={tw`items-center justify-end flex-grow w-full mb-2`} {...contractActionsProps} />
        </ContractContext.Provider>
      </View>
    </PeachScrollView>
  )
}
