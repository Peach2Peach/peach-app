import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../contexts/overlay'
import { account } from '../utils/account'
import {
  shouldShowBuyerCanceledTrade,
  shouldShowCancelTradeRequestConfirmed,
  shouldShowCancelTradeRequestRejected,
  shouldShowConfirmCancelTradeRequest,
  shouldShowDisputeResult,
  shouldShowYouGotADispute,
} from '../utils/overlay'
import { useDisputeRaisedNotice } from './dispute/hooks/useDisputeRaisedNotice'
import { useDisputeResults } from './dispute/hooks/useDisputeResults'
import { useBuyerCanceledOverlay } from './tradeCancelation/useBuyerCanceledOverlay'
import { useBuyerRejectedCancelTradeOverlay } from './tradeCancelation/useBuyerRejectedCancelTradeOverlay'
import { useConfirmTradeCancelationOverlay } from './tradeCancelation/useConfirmTradeCancelationOverlay'

export const useHandleContractOverlays = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const showDisputeRaisedNotice = useDisputeRaisedNotice()
  const showDisputeResults = useDisputeResults()
  const showConfirmTradeCancelation = useConfirmTradeCancelationOverlay()
  const showBuyerCanceled = useBuyerCanceledOverlay()
  const showCancelTradeRequestRejected = useBuyerRejectedCancelTradeOverlay()

  const handleContractOverlays = useCallback(
    (contract: Contract, view: ContractViewer) => {
      if (shouldShowYouGotADispute(contract, account)) return showDisputeRaisedNotice(contract, view)
      if (shouldShowDisputeResult(contract)) return showDisputeResults(contract, view)

      if (shouldShowConfirmCancelTradeRequest(contract, view)) return showConfirmTradeCancelation(contract)
      if (shouldShowBuyerCanceledTrade(contract, view)) return showBuyerCanceled(contract, false)
      if (shouldShowCancelTradeRequestConfirmed(contract, view)) return showBuyerCanceled(contract, true)
      if (shouldShowCancelTradeRequestRejected(contract, view)) return showCancelTradeRequestRejected(contract)

      return null
    },
    [showBuyerCanceled, showCancelTradeRequestRejected, showConfirmTradeCancelation, updateOverlay],
  )

  return handleContractOverlays
}
