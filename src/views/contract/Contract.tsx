import { NewHeader, PeachScrollView, Screen } from '../../components'
import { TradeSummary } from '../../components/offer'
import tw from '../../styles/tailwind'

import { useMemo } from 'react'
import { useRoute, useShowHelp } from '../../hooks'
import { useConfirmCancelTrade } from '../../popups/tradeCancelation'
import { canCancelContract, contractIdToHex } from '../../utils/contract'
import { headerIcons } from '../../utils/layout'
import { LoadingScreen } from '../loading/LoadingScreen'
import { ContractActions } from './ContractActions'
import { ContractContext, useContractContext } from './context'
import { useContractSetup } from './hooks/useContractSetup'

export const Contract = () => {
  const { contract, isLoading, view, showBatchInfo, toggleShowBatchInfo, ...contractActionsProps } = useContractSetup()

  if (!contract || !view || isLoading) return <LoadingScreen />

  return (
    <Screen>
      <ContractContext.Provider value={{ contract, view, showBatchInfo, toggleShowBatchInfo }}>
        <ContractHeader requiredAction={contractActionsProps.requiredAction} />
        <PeachScrollView contentContainerStyle={[tw`grow pt-sm`, tw.md`pt-md`]} contentStyle={tw`grow`}>
          <TradeSummary />
          <ContractActions style={tw`items-center justify-end w-full mt-auto mb-2`} {...contractActionsProps} />
        </PeachScrollView>
      </ContractContext.Provider>
    </Screen>
  )
}

type Props = {
  requiredAction: ContractAction
}

function ContractHeader ({ requiredAction }: Props) {
  const { contract, view } = useContractContext()
  const route = useRoute<'contract'>()
  const { contractId } = route.params
  const { showConfirmPopup } = useConfirmCancelTrade()
  const showMakePaymentHelp = useShowHelp('makePayment')
  const showConfirmPaymentHelp = useShowHelp('confirmPayment')

  const memoizedIcons = useMemo(() => {
    const icons = []
    if (contract && canCancelContract(contract, view)) icons.push({
      ...headerIcons.cancel,
      onPress: () => showConfirmPopup(contract),
    })
    if (view === 'buyer' && requiredAction === 'sendPayment') icons.push({
      ...headerIcons.help,
      onPress: showMakePaymentHelp,
    })
    if (view === 'seller' && requiredAction === 'confirmPayment') icons.push({
      ...headerIcons.help,
      onPress: showConfirmPaymentHelp,
    })
    return contract?.disputeActive ? [] : icons
  }, [showConfirmPopup, contract, requiredAction, showConfirmPaymentHelp, showMakePaymentHelp, view])

  return <NewHeader title={contractIdToHex(contractId)} icons={memoizedIcons} />
}
