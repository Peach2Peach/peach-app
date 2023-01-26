import React, { useContext } from 'react'
import { DisputeResult } from '../../../overlays/DisputeResult'
import { CancelTradeRequestConfirmed } from '../../../overlays/tradeCancelation/CancelTradeRequestConfirmed'
import { CancelTradeRequestRejected } from '../../../overlays/tradeCancelation/CancelTradeRequestRejected'
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
import { useCancelTradeRequestRejectedOverlay } from './useCancelTradeRequestRejectedOverlay'

export const useHandleOverlays = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const showBuyerCanceled = useBuyerCanceledOverlay()
  const showCancelTradeRequestRejected = useCancelTradeRequestRejectedOverlay()
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

    if (shouldShowConfirmCancelTradeRequest(contract, view)) {
      return updateOverlay({
        content: <ConfirmCancelTradeRequest {...{ contract }} />,
        visible: true,
      })
    }

    if (shouldShowCancelTradeRequestConfirmed(contract, view)) {
      return updateOverlay({
        content: <CancelTradeRequestConfirmed {...{ contract }} />,
        visible: true,
      })
    }

    if (shouldShowCancelTradeRequestRejected(contract, view)) return showCancelTradeRequestRejected(contract)
    if (shouldShowBuyerCanceledTrade(contract, view)) return showBuyerCanceled(contract)

    return null
  }
}
