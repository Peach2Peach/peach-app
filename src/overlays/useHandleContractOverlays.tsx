import React, { useContext } from 'react'
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
import { useBuyerCanceledOverlay } from './tradeCancelation/useBuyerCanceledOverlay'
import { DisputeResult } from './DisputeResult'
import YouGotADispute from './YouGotADispute'
import { useConfirmTradeCancelationOverlay } from './tradeCancelation/useConfirmTradeCancelationOverlay'
import { useBuyerRejectedCancelTradeOverlay } from './tradeCancelation/useBuyerRejectedCancelTradeOverlay'

export const useHandleContractOverlays = () => {
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
