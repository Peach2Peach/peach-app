import { useCallback } from 'react'
import { account } from '../utils/account'
import {
  shouldShowTradeCanceled,
  shouldShowCancelTradeRequestConfirmed,
  shouldShowCancelTradeRequestRejected,
  shouldShowDisputeResult,
  shouldShowPaymentTimerHasRunOut,
  shouldShowYouGotADispute,
} from '../utils/overlay'
import { useDisputeRaisedNotice } from './dispute/hooks/useDisputeRaisedNotice'
import { useDisputeResults } from './dispute/hooks/useDisputeResults'
import { useShowPaymentTimerHasRunOut } from './paymentTimer/useShowPaymentTimerHasRunOut'
import { useTradeCanceledOverlay } from './tradeCancelation/useTradeCanceledOverlay'
import { useBuyerRejectedCancelTradeOverlay } from './tradeCancelation/useBuyerRejectedCancelTradeOverlay'

export const useHandleContractOverlays = () => {
  const { showDisputeRaisedNotice } = useDisputeRaisedNotice()
  const showDisputeResults = useDisputeResults()
  const showTradeCanceled = useTradeCanceledOverlay()
  const showCancelTradeRequestRejected = useBuyerRejectedCancelTradeOverlay()

  const showPaymentTimerHasRunOut = useShowPaymentTimerHasRunOut()

  const handleContractOverlays = useCallback(
    (contract: Contract, view: ContractViewer) => {
      if (shouldShowYouGotADispute(contract, account)) return showDisputeRaisedNotice(contract, view)
      if (shouldShowDisputeResult(contract)) return showDisputeResults(contract, view)

      if (shouldShowTradeCanceled(contract, view)) return showTradeCanceled(contract, false)
      if (shouldShowCancelTradeRequestConfirmed(contract, view)) return showTradeCanceled(contract, true)
      if (shouldShowCancelTradeRequestRejected(contract, view)) return showCancelTradeRequestRejected(contract)
      if (view === 'seller' && shouldShowPaymentTimerHasRunOut(contract)) {
        return showPaymentTimerHasRunOut(contract, true)
      }
      return null
    },
    [
      showTradeCanceled,
      showCancelTradeRequestRejected,
      showDisputeRaisedNotice,
      showDisputeResults,
      showPaymentTimerHasRunOut,
    ],
  )

  return handleContractOverlays
}
