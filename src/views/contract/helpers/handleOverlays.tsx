import React from 'react'
import { DisputeResult } from '../../../overlays/DisputeResult'
import { CancelTradeRequestConfirmed } from '../../../overlays/tradeCancelation/CancelTradeRequestConfirmed'
import { ConfirmCancelTradeRequest } from '../../../overlays/tradeCancelation/ConfirmCancelTradeRequest'
import YouGotADispute from '../../../overlays/YouGotADispute'
import { account } from '../../../utils/account'
import { StackNavigation } from '../../../utils/navigation'

type HandleOverlaysProps = {
  contract: Contract,
  navigation: StackNavigation,
  updateOverlay: React.Dispatch<OverlayState>,
  view: 'buyer' | 'seller' | ''
}

/**
 * @description Helperfunction to open respective overlays if applicable
 * @param contract contract
 * @param navigation navigation
 * @param updateOverlay function to open overlay
 */
export const handleOverlays = ({ contract, navigation, updateOverlay, view }: HandleOverlaysProps) => {
  if (contract.disputeActive
    && contract.disputeInitiator !== account.publicKey
    && !contract.disputeAcknowledgedByCounterParty) {
    return updateOverlay({
      content: <YouGotADispute
        contractId={contract.id}
        message={contract.disputeClaim!}
        reason={contract.disputeReason!}
        navigation={navigation} />,
      showCloseButton: false
    })
  }

  if (!contract.disputeActive && contract.disputeResolvedDate && !contract.disputeResultAcknowledged) {
    return updateOverlay({
      content: <DisputeResult
        contractId={contract.id}
        navigation={navigation} />,
    })
  }

  if (contract.cancelationRequested && view === 'buyer') {
    return updateOverlay({
      content: <ConfirmCancelTradeRequest
        contract={contract}
        navigation={navigation} />,
    })
  }

  if (contract.cancelationRequested && contract.canceled) {
    return updateOverlay({
      content: <CancelTradeRequestConfirmed
        contract={contract}
        navigation={navigation} />,
    })
  }

  return null
}