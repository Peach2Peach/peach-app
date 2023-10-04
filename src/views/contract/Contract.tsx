import { PeachScrollView } from '../../components'
import { TradeSummary } from '../../components/offer'
import tw from '../../styles/tailwind'

import { LoadingScreen } from '../loading/LoadingScreen'
import { ContractActions } from './ContractActions'
import { ContractContext } from './context'
import { useContractSetup } from './hooks/useContractSetup'

export const Contract = () => {
  const { contract, isLoading, view, showBatchInfo, toggleShowBatchInfo, ...contractActionsProps } = useContractSetup()

  if (!contract || !view || isLoading) return <LoadingScreen />

  return (
    <PeachScrollView
      style={[tw`h-full px-sm`, tw.md`px-md`]}
      contentContainerStyle={[tw`flex-grow pt-sm`, tw.md`pt-md`]}
      contentStyle={tw`h-full`}
    >
      <ContractContext.Provider value={{ contract, view, showBatchInfo, toggleShowBatchInfo }}>
        <TradeSummary />
        <ContractActions style={tw`items-center justify-end w-full mt-auto mb-2`} {...contractActionsProps} />
      </ContractContext.Provider>
    </PeachScrollView>
  )
}
