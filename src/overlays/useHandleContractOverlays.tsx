import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../contexts/overlay'
import { account } from '../utils/account'
import {
  shouldShowBuyerCanceledTrade,
  shouldShowCancelTradeRequestConfirmed,
  shouldShowCancelTradeRequestRejected,
  shouldShowDisputeResult,
  shouldShowYouGotADispute,
} from '../utils/overlay'
import { DisputeResult } from './DisputeResult'
import { useBuyerCanceledOverlay } from './tradeCancelation/useBuyerCanceledOverlay'
import { useBuyerRejectedCancelTradeOverlay } from './tradeCancelation/useBuyerRejectedCancelTradeOverlay'
import YouGotADispute from './YouGotADispute'

export const useHandleContractOverlays = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const showBuyerCanceled = useBuyerCanceledOverlay()
  const showCancelTradeRequestRejected = useBuyerRejectedCancelTradeOverlay()

  const handleContractOverlays = useCallback(
    (contract: Contract, view: ContractViewer) => {
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

      if (shouldShowBuyerCanceledTrade(contract, view)) return showBuyerCanceled(contract, false)
      if (shouldShowCancelTradeRequestConfirmed(contract, view)) return showBuyerCanceled(contract, true)
      if (shouldShowCancelTradeRequestRejected(contract, view)) return showCancelTradeRequestRejected(contract)

      return null
    },
    [showBuyerCanceled, showCancelTradeRequestRejected, updateOverlay],
  )

  return handleContractOverlays
}
