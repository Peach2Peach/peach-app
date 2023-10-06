import { Header, PeachScrollView, Screen } from '../../components'
import tw from '../../styles/tailwind'

import { useMemo } from 'react'
import { useRoute, useShowHelp, useToggleBoolean } from '../../hooks'
import { useConfirmCancelTrade } from '../../popups/tradeCancelation'
import { canCancelContract, contractIdToHex } from '../../utils/contract'
import { isPaymentTooLate } from '../../utils/contract/status/isPaymentTooLate'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { LoadingScreen } from '../loading/LoadingScreen'
import { ContractActions } from './ContractActions'
import { PendingPayoutInfo } from './components/PendingPayoutInfo'
import { TradeInformation } from './components/TradeInformation'
import { ContractContext, useContractContext } from './context'
import { useContractSetup } from './hooks/useContractSetup'

export const Contract = () => {
  const { contract, saveAndUpdate, isLoading, view, requiredAction } = useContractSetup()
  const [showBatchInfo, toggleShowBatchInfo] = useToggleBoolean()

  if (!contract || !view || isLoading) return <LoadingScreen />

  return (
    <ContractContext.Provider value={{ contract, view, showBatchInfo, toggleShowBatchInfo, saveAndUpdate }}>
      <Screen header={<ContractHeader requiredAction={requiredAction} />}>
        <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`grow`}>
          {showBatchInfo ? <PendingPayoutInfo /> : <TradeInformation />}
          <ContractActions requiredAction={requiredAction} />
        </PeachScrollView>
      </Screen>
    </ContractContext.Provider>
  )
}

type Props = {
  requiredAction: ContractAction
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

  const theme = useMemo(() => {
    if (contract?.disputeActive) return 'dispute'
    if (contract?.canceled) return 'cancel'
    if (isPaymentTooLate(contract)) return 'paymentTooLate'
    return view
  }, [contract, view])

  const title = useMemo(() => {
    const { tradeStatus } = contract
    if (view === 'buyer') {
      if (tradeStatus === 'paymentRequired') return i18n('offer.requiredAction.paymentRequired')
      if (tradeStatus === 'confirmPaymentRequired') return i18n('offer.requiredAction.waiting.seller')
    }

    if (isPaymentTooLate(contract)) {
      return i18n('contract.seller.paymentTimerHasRunOut.title', contractIdToHex(contract.id))
    }
    if (tradeStatus === 'paymentRequired') return i18n('offer.requiredAction.waiting.buyer')
    if (tradeStatus === 'confirmPaymentRequired') return i18n('offer.requiredAction.confirmPaymentRequired')
    return contractIdToHex(contractId)
  }, [contract, contractId, view])

  return (
    <Header
      icons={memoizedIcons}
      title={title}
      theme={theme}
      subtitle={
        <Header.Subtitle
          amount={contract.amount}
          premium={contract.premium}
          viewer={view}
          theme={theme}
          text={contract.releaseTxId ? (view === 'buyer' ? i18n('contract.bought') : i18n('contract.sold')) : undefined}
        />
      }
    />
  )
}
