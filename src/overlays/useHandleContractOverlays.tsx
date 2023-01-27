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
import { DisputeResult } from './DisputeResult'
import { useBuyerCanceledOverlay } from './tradeCancelation/useBuyerCanceledOverlay'
import { useBuyerRejectedCancelTradeOverlay } from './tradeCancelation/useBuyerRejectedCancelTradeOverlay'
import { useConfirmTradeCancelationOverlay } from './tradeCancelation/useConfirmTradeCancelationOverlay'

export const useHandleContractOverlays = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const showDisputeRaisedNotice = useDisputeRaisedNotice()
  const showConfirmTradeCancelation = useConfirmTradeCancelationOverlay()
  const showBuyerCanceled = useBuyerCanceledOverlay()
  const showCancelTradeRequestRejected = useBuyerRejectedCancelTradeOverlay()

  const handleContractOverlays = useCallback(
    (contract: Contract, view: ContractViewer) => {
      const contractId = contract.id
      if (shouldShowYouGotADispute(contract, account)) showDisputeRaisedNotice(contract, view)

      if (shouldShowDisputeResult(contract)) {
        return updateOverlay({
          content: <DisputeResult {...{ contractId }} />,
          visible: true,
        })
      }

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
