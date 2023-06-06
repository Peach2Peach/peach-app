import { useMemo } from 'react'
import { useConfirmTradeCancelationPopup } from '../../../../popups/tradeCancelation'
import { useTradeCanceledPopup } from '../../../../popups/tradeCancelation/useTradeCanceledPopup'
import { usePaymentTooLatePopup } from '../../../../popups/usePaymentTooLatePopup'

type PNEventHandlers = Partial<Record<NotificationType, (contract: Contract) => void>>

export const useContractPopupEvents = () => {
  const { showConfirmTradeCancelation } = useConfirmTradeCancelationPopup()
  const { showTradeCanceled } = useTradeCanceledPopup()
  const showPaymentTooLatePopup = usePaymentTooLatePopup()

  const contractPopupEvents: PNEventHandlers = useMemo(
    () => ({
      'contract.canceled': (contract: Contract) => showTradeCanceled(contract, false),
      // PN-S14
      'contract.seller.canceledAfterEscrowExpiry': (contract: Contract) => showTradeCanceled(contract, false),
      // PN-B08
      'contract.cancelationRequest': (contract: Contract) =>
        !contract.disputeActive ? showConfirmTradeCancelation(contract) : null,
      // PN-B12
      'contract.buyer.paymentTimerHasRunOut': () => showPaymentTooLatePopup(),
    }),
    [showConfirmTradeCancelation, showPaymentTooLatePopup, showTradeCanceled],
  )

  return contractPopupEvents
}
