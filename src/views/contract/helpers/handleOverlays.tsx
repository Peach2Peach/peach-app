import React from 'react'
import { DisputeResult } from '../../../overlays/DisputeResult'
import { CancelTradeRequestConfirmed } from '../../../overlays/tradeCancelation/CancelTradeRequestConfirmed'
import { CancelTradeRequestRejected } from '../../../overlays/tradeCancelation/CancelTradeRequestRejected'
import { BuyerCanceledTrade } from '../../../overlays/tradeCancelation/BuyerCanceledTrade'
import { ConfirmCancelTradeRequest } from '../../../overlays/tradeCancelation/ConfirmCancelTradeRequest'
import YouGotADispute from '../../../overlays/YouGotADispute'
import { account } from '../../../utils/account'
import { StackNavigation } from '../../../utils/navigation'

type HandleOverlaysProps = {
  contract: Contract
  navigation: StackNavigation
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
export const handleOverlays = ({ contract, navigation, updateOverlay, view }: HandleOverlaysProps) => {
  const contractId = contract.id
  if (
    contract.disputeActive
    && contract.disputeInitiator !== account.publicKey
    && !contract.disputeAcknowledgedByCounterParty
  ) {
    return updateOverlay({
      content: (
        <YouGotADispute
          {...{ contractId, message: contract.disputeClaim!, reason: contract.disputeReason!, navigation }}
        />
      ),
      visible: true,
    })
  }

  if (!contract.disputeActive && contract.disputeResolvedDate && !contract.disputeResultAcknowledged) {
    return updateOverlay({
      content: <DisputeResult {...{ contractId, navigation }} />,
      visible: true,
    })
  }

  if (contract.cancelationRequested && view === 'buyer' && !contract.disputeActive && !contract.paymentConfirmed) {
    return updateOverlay({
      content: <ConfirmCancelTradeRequest {...{ contract, navigation }} />,
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
      content: <CancelTradeRequestConfirmed {...{ contract, navigation }} />,
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
      content: <CancelTradeRequestRejected {...{ contract, navigation }} />,
      visible: true,
    })
  }

  if (contract.canceled && view === 'seller' && !contract.cancelConfirmationDismissed && !contract.paymentConfirmed) {
    return updateOverlay({
      content: <BuyerCanceledTrade {...{ contract, navigation }} />,
      visible: true,
    })
  }

  return null
}
