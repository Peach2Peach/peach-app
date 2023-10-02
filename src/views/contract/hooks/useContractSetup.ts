import { useIsFocused } from '@react-navigation/native'
import { useCallback, useEffect, useState } from 'react'
import { useNavigation, useRoute, useToggleBoolean } from '../../../hooks'
import { useCommonContractSetup } from '../../../hooks/useCommonContractSetup'
import { useShowErrorBanner } from '../../../hooks/useShowErrorBanner'
import {
  getNavigationDestinationForContract,
  getSellOfferFromContract,
  shouldRateCounterParty,
  verifyAndSignReleaseTx,
} from '../../../utils/contract'
import { isTradeComplete } from '../../../utils/contract/status'
import { peachAPI } from '../../../utils/peachAPI'
import { getEscrowWalletForOffer } from '../../../utils/wallet'
import { getNavigationDestinationForOffer } from '../../yourTrades/utils'
import { useContractHeaderSetup } from './useContractHeaderSetup'
import { useShowHighFeeWarning } from './useShowHighFeeWarning'
import { useShowLowFeeWarning } from './useShowLowFeeWarning'

// eslint-disable-next-line max-lines-per-function
export const useContractSetup = () => {
  const route = useRoute<'contract'>()
  const { contractId } = route.params
  const isFocused = useIsFocused()
  const { contract, saveAndUpdate, isLoading, view, requiredAction, newOfferId, refetch }
    = useCommonContractSetup(contractId)
  const navigation = useNavigation()
  const showError = useShowErrorBanner()
  const [actionPending, setActionPending] = useState(false)
  const [showBatchInfo, toggleShowBatchInfo] = useToggleBoolean()
  const shouldShowFeeWarning = view === 'buyer' && !!contract?.paymentMade && !contract?.paymentConfirmed

  useContractHeaderSetup({
    contract,
    view,
    requiredAction,
    contractId,
  })
  useShowHighFeeWarning({ enabled: shouldShowFeeWarning, amount: contract?.amount })
  useShowLowFeeWarning({ enabled: shouldShowFeeWarning })

  useEffect(() => {
    if (!contract || !view || isLoading || !isFocused) return
    if (isTradeComplete(contract) && !contract.disputeWinner && !contract.canceled) {
      if (shouldRateCounterParty(contract, view)) {
        refetch().then(({ data }) => {
          if (data && shouldRateCounterParty(data, view)) navigation.replace('tradeComplete', { contract: data })
        })
      }
    }
  }, [contract, isFocused, isLoading, navigation, refetch, view])

  const postConfirmPaymentBuyer = useCallback(async () => {
    const { error: err } = await peachAPI.private.contract.confirmPayment({ contractId })

    if (err) {
      showError(err.error)

      return
    }

    saveAndUpdate({
      paymentMade: new Date(),
    })
  }, [contractId, saveAndUpdate, showError])

  const postConfirmPaymentSeller = useCallback(async () => {
    if (!contract) return
    setActionPending(true)

    const sellOffer = getSellOfferFromContract(contract)
    const { releaseTransaction, batchReleasePsbt, errorMsg } = verifyAndSignReleaseTx(
      contract,
      sellOffer,
      getEscrowWalletForOffer(sellOffer),
    )

    if (!releaseTransaction) {
      setActionPending(false)
      showError(errorMsg)
      return
    }

    const { result, error: err } = await peachAPI.private.contract.confirmPayment({
      contractId: contract.id,
      releaseTransaction,
      batchReleasePsbt,
    })

    setActionPending(false)

    if (err) {
      showError(err.error)
      return
    }

    saveAndUpdate({
      paymentConfirmed: new Date(),
      releaseTxId: result?.txId || '',
    })
  }, [contract, saveAndUpdate, showError])

  const goToNewOffer = useCallback(async () => {
    if (!newOfferId) return
    const { result: newOffer } = await peachAPI.private.offer.getOfferDetails({ offerId: newOfferId })
    if (newOffer?.contractId) {
      const { result: newContract } = await peachAPI.private.contract.getContract({ contractId: newOffer.contractId })
      if (!newContract) return
      const [screen, params] = await getNavigationDestinationForContract(newContract)
      navigation.replace(screen, params)
    } else {
      navigation.replace(...getNavigationDestinationForOffer(newOffer))
    }
  }, [newOfferId, navigation])

  return {
    contract,
    isLoading,
    view,
    requiredAction,
    actionPending,
    hasNewOffer: !!newOfferId,
    postConfirmPaymentBuyer,
    postConfirmPaymentSeller,
    goToNewOffer,
    showBatchInfo,
    toggleShowBatchInfo,
  }
}
