import React, { useContext } from 'react'
import { OverlayContext } from '../../../contexts/overlay'
import { CancelTradeRequestRejected } from '../../../overlays/tradeCancelation/CancelTradeRequestRejected'
import { saveContract } from '../../../utils/contract'
import i18n from '../../../utils/i18n'

export const useCancelTradeRequestRejectedOverlay = () => {
  const [, updateOverlay] = useContext(OverlayContext)

  const confirmOverlay = (contract: Contract) => {
    updateOverlay({ visible: false })
    saveContract({
      ...contract,
      cancelConfirmationDismissed: true,
      cancelConfirmationPending: false,
    })
  }

  return (contract: Contract) => {
    updateOverlay({
      title: i18n('contract.cancel.buyerRejected.title'),
      content: <CancelTradeRequestRejected contract={contract} />,
      visible: true,
      requireUserAction: true,
      level: 'WARN',
      action1: {
        label: i18n('close'),
        icon: 'xSquare',
        callback: () => confirmOverlay(contract),
      },
    })
  }
}
