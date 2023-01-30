import React, { useContext } from 'react'
import { DisputeResult } from '../../../overlays/DisputeResult'
import { CancelTradeRequestConfirmed } from '../../../overlays/tradeCancelation/CancelTradeRequestConfirmed'
import { CancelTradeRequestRejected } from '../../../overlays/tradeCancelation/CancelTradeRequestRejected'
import { BuyerCanceledTrade } from '../../../overlays/tradeCancelation/BuyerCanceledTrade'
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

export const useHandleOverlays = () => {
  const [, updateOverlay] = useContext(OverlayContext)

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

    if (shouldShowCancelTradeRequestRejected(contract, view)) {
      return updateOverlay({
        content: <CancelTradeRequestRejected {...{ contract }} />,
        visible: true,
      })
    }

    if (shouldShowBuyerCanceledTrade(contract, view)) {
      return updateOverlay({
        content: <BuyerCanceledTrade {...{ contract }} />,
        visible: true,
      })
    }

    return null
  }
}
