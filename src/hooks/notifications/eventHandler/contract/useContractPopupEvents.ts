import { useMemo } from 'react'
import { useConfirmContractCancelationPopup } from '../../../../popups/tradeCancelation'
import { useTradeCanceledPopup } from '../../../../popups/tradeCancelation/useTradeCanceledPopup'
import { usePaymentTooLatePopup } from '../../../../popups/usePaymentTooLatePopup'

type PNEventHandlers = Partial<Record<NotificationType, (contract: Contract) => void>>

export const useContractPopupEvents = () => {
  const { showConfirmContractCancelation } = useConfirmContractCancelationPopup()
  const { showTradeCanceled } = useTradeCanceledPopup()
  const showPaymentTooLatePopup = usePaymentTooLatePopup()

  const contractPopupEvents: PNEventHandlers = useMemo(
    () => ({
      'contract.canceled': (contract: Contract) => showTradeCanceled(contract, false),
      // PN-S14
      'contract.seller.canceledAfterEscrowExpiry': (contract: Contract) => showTradeCanceled(contract, false),
      // PN-B08
      'contract.cancelationRequest': (contract: Contract) =>
        !contract.disputeActive ? showConfirmContractCancelation(contract) : null,
      // PN-B12
      'contract.buyer.paymentTimerHasRunOut': () => showPaymentTooLatePopup(),
    }),
    [showConfirmContractCancelation, showPaymentTooLatePopup, showTradeCanceled],
  )

  return contractPopupEvents
}
