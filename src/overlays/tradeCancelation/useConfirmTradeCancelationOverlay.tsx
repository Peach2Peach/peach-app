import React, { useCallback, useContext } from 'react'
import { OverlayContext } from '../../contexts/overlay'
import i18n from '../../utils/i18n'
import { ConfirmCancelTradeRequest } from './ConfirmCancelTradeRequest'
import { useCancelTradeSetup } from './utils/useTradeCancelationSetup'

export const useConfirmTradeCancelationOverlay = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const { cancelTrade, continueTrade } = useCancelTradeSetup()

  const showConfirmTradeCancelation = useCallback(
    (contract: Contract) => {
      updateOverlay({
        title: i18n('contract.cancel.sellerWantsToCancel.title'),
        content: <ConfirmCancelTradeRequest contract={contract} />,
        visible: true,
        level: 'WARN',
        action2: {
          label: i18n('contract.cancel.sellerWantsToCancel.cancel'),
          icon: 'xCircle',
          callback: () => cancelTrade(contract),
        },
        action1: {
          label: i18n('contract.cancel.sellerWantsToCancel.continue'),
          icon: 'arrowRightCircle',
          callback: () => continueTrade(contract),
        },
      })
    },
    [cancelTrade, continueTrade, updateOverlay],
  )

  return showConfirmTradeCancelation
}
