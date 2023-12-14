import { Screen } from '../../components'
import tw from '../../styles/tailwind'

import { useMemo } from 'react'
import { Header, HeaderIcon } from '../../components/Header'
import { PeachScrollView } from '../../components/PeachScrollView'
import { useShowHelp, useToggleBoolean } from '../../hooks'
import { useConfirmCancelTrade } from '../../popups/tradeCancelation'
import { canCancelContract } from '../../utils/contract/canCancelContract'
import { contractIdToHex } from '../../utils/contract/contractIdToHex'
import { getRequiredAction } from '../../utils/contract/getRequiredAction'
import { isPaymentTooLate } from '../../utils/contract/status/isPaymentTooLate'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout/headerIcons'
import { useDecryptedContractData } from '../contractChat/useDecryptedContractData'
import { LoadingScreen } from '../loading/LoadingScreen'
import { ContractActions } from './ContractActions'
import { PendingPayoutInfo } from './components/PendingPayoutInfo'
import { TradeInformation } from './components/TradeInformation'
import { ContractContext, useContractContext } from './context'
import { useContractSetup } from './hooks/useContractSetup'

export const Contract = () => {
  const { contract, isLoading, view } = useContractSetup()
  const { data, isLoading: isLoadingPaymentData, isError } = useDecryptedContractData(contract)
  const [showBatchInfo, toggleShowBatchInfo] = useToggleBoolean()

  if (!contract || !view || isLoading || isLoadingPaymentData) return <LoadingScreen />

  return (
    <ContractContext.Provider
      value={{
        contract,
        paymentData: data?.paymentData,
        isDecryptionError: isError,
        view,
        showBatchInfo,
        toggleShowBatchInfo,
      }}
    >
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
  const { contract, view } = useContractContext()
  const { tradeStatus, disputeActive, canceled, disputeWinner, releaseTxId, batchInfo, amount, premium } = contract
  const requiredAction = getRequiredAction(contract)
  const showConfirmPopup = useConfirmCancelTrade()
  const showMakePaymentHelp = useShowHelp('makePayment')
  const showConfirmPaymentHelp = useShowHelp('confirmPayment')

  const memoizedIcons = useMemo(() => {
    const icons: HeaderIcon[] = []
    if (disputeActive) return icons

    if (canCancelContract(contract, view)) icons.push({
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
    return icons
  }, [contract, view, requiredAction, showMakePaymentHelp, showConfirmPaymentHelp, disputeActive, showConfirmPopup])

  const theme = useMemo(() => {
    if (disputeActive || disputeWinner) return 'dispute'
    if (canceled || tradeStatus === 'confirmCancelation') return 'cancel'
    if (isPaymentTooLate(contract)) return 'paymentTooLate'
    return view
  }, [canceled, contract, disputeActive, disputeWinner, tradeStatus, view])

  const title = getHeaderTitle(view, contract)

  const isTradeCompleted = releaseTxId || (batchInfo && batchInfo.completed) || tradeStatus === 'payoutPending'

  return (
    <Header
      icons={memoizedIcons}
      {...{ title, theme }}
      subtitle={
        <Header.Subtitle
          text={isTradeCompleted ? (view === 'buyer' ? i18n('contract.bought') : i18n('contract.sold')) : undefined}
          viewer={view}
          {...{ amount, premium, theme }}
        />
      }
    />
  )
}
function getHeaderTitle (view: string, contract: Contract) {
  const { tradeStatus, disputeWinner, canceled, disputeActive, id: contractId } = contract
  if (view === 'buyer') {
    if (disputeWinner === 'buyer') return i18n('contract.disputeWon')
    if (disputeWinner === 'seller') return i18n('contract.disputeLost')

    if (tradeStatus === 'paymentRequired') {
      if (isPaymentTooLate(contract)) return i18n('contract.paymentTimerHasRunOut.title')
      return i18n('offer.requiredAction.paymentRequired')
    }
    if (tradeStatus === 'confirmPaymentRequired') return i18n('offer.requiredAction.waiting.seller')
    if (tradeStatus === 'confirmCancelation') return i18n('offer.requiredAction.confirmCancelation.buyer')
  }

  if (view === 'seller') {
    if (disputeWinner === 'seller') return i18n('contract.disputeWon')
    if (disputeWinner === 'buyer') return i18n('contract.disputeLost')
    if (canceled) return i18n('contract.tradeCanceled')
  }

  if (isPaymentTooLate(contract)) {
    return i18n('contract.paymentTimerHasRunOut.title')
  }
  if (disputeActive) return i18n('offer.requiredAction.dispute')
  if (tradeStatus === 'confirmCancelation') return i18n('offer.requiredAction.confirmCancelation.seller')
  if (tradeStatus === 'paymentRequired') return i18n('offer.requiredAction.waiting.buyer')
  if (tradeStatus === 'confirmPaymentRequired') return i18n('offer.requiredAction.confirmPaymentRequired')
  return contractIdToHex(contractId)
}
