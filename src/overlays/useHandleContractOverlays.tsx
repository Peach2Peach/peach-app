import { useCallback } from 'react'
import { account } from '../utils/account'
import {
  shouldShowBuyerCanceledTrade,
  shouldShowCancelTradeRequestConfirmed,
  shouldShowCancelTradeRequestRejected,
  shouldShowDisputeResult,
  shouldShowPaymentTimerHasRunOut,
  shouldShowYouGotADispute,
} from '../utils/overlay'
import { useDisputeRaisedNotice } from './dispute/hooks/useDisputeRaisedNotice'
import { useDisputeResults } from './dispute/hooks/useDisputeResults'
import { useShowPaymentTimerHasRunOut } from './paymentTimer/useShowPaymentTimerHasRunOut'
import { useBuyerCanceledOverlay } from './tradeCancelation/useBuyerCanceledOverlay'
import { useBuyerRejectedCancelTradeOverlay } from './tradeCancelation/useBuyerRejectedCancelTradeOverlay'

export const useHandleContractOverlays = () => {
  const showDisputeRaisedNotice = useDisputeRaisedNotice()
  const showDisputeResults = useDisputeResults()
  const showBuyerCanceled = useBuyerCanceledOverlay()
  const showCancelTradeRequestRejected = useBuyerRejectedCancelTradeOverlay()

  const showPaymentTimerHasRunOut = useShowPaymentTimerHasRunOut()

  const handleContractOverlays = useCallback(
    (contract: Contract, view: ContractViewer) => {
      if (shouldShowYouGotADispute(contract, account)) return showDisputeRaisedNotice(contract, view)
      if (shouldShowDisputeResult(contract)) return showDisputeResults(contract, view)

      if (shouldShowBuyerCanceledTrade(contract, view)) return showBuyerCanceled(contract, false)
      if (shouldShowCancelTradeRequestConfirmed(contract, view)) return showBuyerCanceled(contract, true)
      if (shouldShowCancelTradeRequestRejected(contract, view)) return showCancelTradeRequestRejected(contract)
      if (view === 'seller' && shouldShowPaymentTimerHasRunOut(contract)) {
        return showPaymentTimerHasRunOut(contract, view, true)
      }
      return null
    },
    [
      showBuyerCanceled,
      showCancelTradeRequestRejected,
      showDisputeRaisedNotice,
      showDisputeResults,
      showPaymentTimerHasRunOut,
    ],
  )

  return handleContractOverlays
}
