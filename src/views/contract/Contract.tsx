import { Header, PeachScrollView, Screen } from '../../components'
import tw from '../../styles/tailwind'

import { useMemo } from 'react'
import { useRoute, useShowHelp, useToggleBoolean } from '../../hooks'
import { useConfirmCancelTrade } from '../../popups/tradeCancelation'
import { canCancelContract, contractIdToHex, getRequiredAction } from '../../utils/contract'
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
  const { contract, isLoading, view } = useContractSetup()
  const [showBatchInfo, toggleShowBatchInfo] = useToggleBoolean()

  if (!contract || !view || isLoading) return <LoadingScreen />

  return (
    <ContractContext.Provider value={{ contract, view, showBatchInfo, toggleShowBatchInfo }}>
      <Screen header={<ContractHeader />}>
        <PeachScrollView contentContainerStyle={tw`grow`} contentStyle={tw`grow`}>
          {showBatchInfo ? <PendingPayoutInfo /> : <TradeInformation />}
          <ContractActions />
        </PeachScrollView>
      </Screen>
    </ContractContext.Provider>
  )
}

function ContractHeader () {
  const { contractId } = useRoute<'contract'>().params
  const { contract, view } = useContractContext()
  const { tradeStatus } = contract
  const requiredAction = getRequiredAction(contract)
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
    if (contract?.canceled || tradeStatus === 'confirmCancelation') return 'cancel'
    if (isPaymentTooLate(contract)) return 'paymentTooLate'
    return view
  }, [contract, tradeStatus, view])

  const title = useMemo(() => {
    if (view === 'buyer') {
      if (tradeStatus === 'paymentRequired') {
        if (isPaymentTooLate(contract)) return i18n('contract.seller.paymentTimerHasRunOut.title')
        return i18n('offer.requiredAction.paymentRequired')
      }
      if (tradeStatus === 'confirmPaymentRequired') return i18n('offer.requiredAction.waiting.seller')
      if (tradeStatus === 'confirmCancelation') return i18n('offer.requiredAction.confirmCancelation.buyer')
    }
    if (view === 'seller') {
      if (contract?.canceled) return i18n('contract.tradeCanceled')
    }
    if (isPaymentTooLate(contract)) {
      return i18n('contract.seller.paymentTimerHasRunOut.title', contractIdToHex(contract.id))
    }
    if (tradeStatus === 'confirmCancelation') return i18n('offer.requiredAction.confirmCancelation.seller')
    if (tradeStatus === 'paymentRequired') return i18n('offer.requiredAction.waiting.buyer')
    if (tradeStatus === 'confirmPaymentRequired') return i18n('offer.requiredAction.confirmPaymentRequired')
    return contractIdToHex(contractId)
  }, [contract, contractId, tradeStatus, view])

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
