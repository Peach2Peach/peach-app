import React from 'react'
import { DisputeResult } from './DisputeResult'
import { CancelTradeRequestConfirmed } from './tradeCancelation/CancelTradeRequestConfirmed'
import { CancelTradeRequestRejected } from './tradeCancelation/CancelTradeRequestRejected'
import { BuyerCanceledTrade } from './tradeCancelation/BuyerCanceledTrade'
import { ConfirmCancelTradeRequest } from './tradeCancelation/ConfirmCancelTradeRequest'
import YouGotADispute from './YouGotADispute'
import { account } from '../utils/account'

type HandleOverlaysProps = {
  contract: Contract
  updateOverlay: React.Dispatch<OverlayState>
  view: 'buyer' | 'seller' | ''
}

/**
 * @description Helperfunction to open respective overlays if applicable
 * @param contract contract
 * @param navigation navigation
 * @param updateOverlay function to open overlay
 */
// eslint-disable-next-line complexity
export const handleOverlays = ({ contract, updateOverlay, view }: HandleOverlaysProps) => {
  const contractId = contract.id
  if (
    contract.disputeActive
    && contract.disputeInitiator !== account.publicKey
    && !contract.disputeAcknowledgedByCounterParty
  ) {
    return updateOverlay({
      content: <YouGotADispute {...{ contractId, message: contract.disputeClaim!, reason: contract.disputeReason! }} />,
      visible: true,
    })
  }

  if (!contract.disputeActive && contract.disputeResolvedDate && !contract.disputeResultAcknowledged) {
    return updateOverlay({
      content: <DisputeResult {...{ contractId }} />,
      visible: true,
    })
  }

  if (contract.cancelationRequested && view === 'buyer' && !contract.disputeActive && !contract.paymentConfirmed) {
    return updateOverlay({
      content: <ConfirmCancelTradeRequest {...{ contract }} />,
      visible: true,
    })
  }

  if (
    contract.canceled
    && view === 'seller'
    && !contract.paymentConfirmed
    && !contract.cancelationRequested
    && contract.cancelConfirmationPending
    && !contract.cancelConfirmationDismissed
  ) {
    return updateOverlay({
      content: <CancelTradeRequestConfirmed {...{ contract }} />,
      visible: true,
    })
  }

  if (
    !contract.canceled
    && view === 'seller'
    && !contract.paymentConfirmed
    && !contract.cancelationRequested
    && contract.cancelConfirmationPending
    && !contract.cancelConfirmationDismissed
  ) {
    return updateOverlay({
      content: <CancelTradeRequestRejected {...{ contract }} />,
      visible: true,
    })
  }

  if (contract.canceled && view === 'seller' && !contract.cancelConfirmationDismissed && !contract.paymentConfirmed) {
    return updateOverlay({
      content: <BuyerCanceledTrade {...{ contract }} />,
      visible: true,
    })
  }

  return null
}
