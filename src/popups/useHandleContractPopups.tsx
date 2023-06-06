import { useCallback } from 'react'
import {
  shouldShowTradeCanceled,
  shouldShowCancelTradeRequestConfirmed,
  shouldShowCancelTradeRequestRejected,
  shouldShowDisputeResult,
  shouldShowPaymentTimerHasRunOut,
} from '../utils/popup'
import { useDisputeResults } from './dispute/hooks/useDisputeResults'
import { useShowPaymentTimerHasRunOut } from './paymentTimer/useShowPaymentTimerHasRunOut'
import { useTradeCanceledPopup } from './tradeCancelation/useTradeCanceledPopup'
import { useBuyerRejectedCancelTradePopup } from './tradeCancelation/useBuyerRejectedCancelTradePopup'

export const useHandleContractPopups = () => {
  const showDisputeResults = useDisputeResults()
  const { showTradeCanceled } = useTradeCanceledPopup()
  const showCancelTradeRequestRejected = useBuyerRejectedCancelTradePopup()

  const showPaymentTimerHasRunOut = useShowPaymentTimerHasRunOut()

  const handleContractPopups = useCallback(
    (contract: Contract, view: ContractViewer) => {
      if (shouldShowDisputeResult(contract)) return showDisputeResults(contract, view)

      if (shouldShowTradeCanceled(contract, view)) return showTradeCanceled(contract, false)
      if (shouldShowCancelTradeRequestConfirmed(contract, view)) return showTradeCanceled(contract, true)
      if (shouldShowCancelTradeRequestRejected(contract, view)) return showCancelTradeRequestRejected(contract)
      if (view === 'seller' && shouldShowPaymentTimerHasRunOut(contract)) {
        return showPaymentTimerHasRunOut(contract, true)
      }
      return null
    },
    [showTradeCanceled, showCancelTradeRequestRejected, showDisputeResults, showPaymentTimerHasRunOut],
  )

  return handleContractPopups
}
