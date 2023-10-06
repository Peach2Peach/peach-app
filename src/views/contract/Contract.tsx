import { Header, PeachScrollView, Screen } from '../../components'
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
    <ContractContext.Provider value={{ contract, view, showBatchInfo, toggleShowBatchInfo }}>
      <Screen header={<ContractHeader requiredAction={contractActionsProps.requiredAction} />}>
        <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`grow`}>
          <TradeSummary />
          <ContractActions style={tw`items-center justify-end w-full`} {...contractActionsProps} />
        </PeachScrollView>
      </Screen>
    </ContractContext.Provider>
  )
}

type Props = {
  requiredAction: ContractAction
}

const themes = {
  buyer: tw`bg-success-background-dark border-success-mild-1 text-success-main`,
  seller: tw`bg-primary-background-dark border-primary-mild-1 text-primary-main`,
  paymentTooLate: tw`bg-warning-mild-1 border-warning-mild-2 text-black-1`,
  dispute: tw`bg-error-main border-error-dark text-primary-background-light`,
  cancel: tw`bg-black-5 border-black-4 text-black-2`,
}

function ContractHeader ({ requiredAction }: Props) {
  const { contractId } = useRoute<'contract'>().params
  const { contract, view } = useContractContext()
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

  return (
    <Header
      icons={memoizedIcons}
      title={contractIdToHex(contractId)}
      style={[tw`border-b rounded-b-lg`, themes.dispute]}
      theme="buyer"
      subtitle={<Header.Subtitle amount={contract.amount} premium={contract.premium} viewer={view} theme="buyer" />}
    />
  )
}
