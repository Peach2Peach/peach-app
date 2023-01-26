import React, { useContext } from 'react'
import { DisputeResult } from '../../../overlays/DisputeResult'
import { CancelTradeRequestConfirmed } from '../../../overlays/tradeCancelation/CancelTradeRequestConfirmed'
import { CancelTradeRequestRejected } from '../../../overlays/tradeCancelation/BuyerRejectedCancelTrade'
import { ConfirmCancelTradeRequest } from '../../../overlays/tradeCancelation/ConfirmCancelTradeRequest'
import YouGotADispute from '../../../overlays/YouGotADispute'
import { account } from '../../../utils/account'
import { OverlayContext } from '../../../contexts/overlay'
import {
  shouldShowBuyerCanceledTrade,
  shouldShowCancelTradeRequestConfirmed,
  shouldShowCancelTradeRequestRejected,
  shouldShowConfirmCancelTradeRequest,
  shouldShowDisputeResult,
  shouldShowYouGotADispute,
} from '../../../utils/overlay'
import { useBuyerCanceledOverlay } from './useBuyerCanceledOverlay'
import { useBuyerRejectedCancelTradeOverlay } from './useBuyerRejectedCancelTradeOverlay'
import { useConfirmTradeCancelationOverlay } from './useConfirmTradeCancelationOVerlay'

export const useHandleOverlays = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const showConfirmTradeCancelation = useConfirmTradeCancelationOverlay()
  const showBuyerCanceled = useBuyerCanceledOverlay()
  const showCancelTradeRequestRejected = useBuyerRejectedCancelTradeOverlay()

  return (contract: Contract, view: ContractViewer) => {
    const contractId = contract.id
    if (shouldShowYouGotADispute(contract, account)) {
      return updateOverlay({
        content: (
          <YouGotADispute {...{ contractId, message: contract.disputeClaim!, reason: contract.disputeReason! }} />
        ),
        visible: true,
      })
    }

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
  }
}
