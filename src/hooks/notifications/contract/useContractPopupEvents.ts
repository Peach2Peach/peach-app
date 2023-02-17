import { useMemo } from 'react'
import { useDisputeRaisedNotice } from '../../../overlays/dispute/hooks/useDisputeRaisedNotice'
import { useDisputeResults } from '../../../overlays/dispute/hooks/useDisputeResults'
import { useShowPaymentReminder } from '../../../overlays/paymentTimer/useShowPaymentReminder'
import { useShowPaymentTimerExtended } from '../../../overlays/paymentTimer/useShowPaymentTimerExtended'
import { useShowPaymentTimerHasRunOut } from '../../../overlays/paymentTimer/useShowPaymentTimerHasRunOut'
import { useShowPaymentTimerSellerCanceled } from '../../../overlays/paymentTimer/useShowPaymentTimerSellerCanceled'
import {
  useBuyerRejectedCancelTradeOverlay,
  useConfirmTradeCancelationOverlay,
} from '../../../overlays/tradeCancelation'
import { useTradeCanceledOverlay } from '../../../overlays/tradeCancelation/useTradeCanceledOverlay'
import { account } from '../../../utils/account'
import { getContractViewer } from '../../../utils/contract'

type PNEventHandlers = Partial<Record<NotificationType, (contract: Contract, data: PNData) => void>>

export const useContractPopupEvents = (currentContractId?: string) => {
  const showDisputeRaisedNotice = useDisputeRaisedNotice()
  const showDisputeResults = useDisputeResults()

  const showConfirmTradeCancelation = useConfirmTradeCancelationOverlay()
  const showTradeCanceled = useTradeCanceledOverlay()
  const showCancelTradeRequestRejected = useBuyerRejectedCancelTradeOverlay()

  const showPaymentReminder = useShowPaymentReminder()
  const showPaymentTimerHasRunOut = useShowPaymentTimerHasRunOut()
  const showPaymentTimerSellerCanceled = useShowPaymentTimerSellerCanceled()
  const showPaymentTimerExtended = useShowPaymentTimerExtended()

  const contractPopupEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-D01
      'contract.buyer.disputeRaised': (contract: Contract) =>
        showDisputeRaisedNotice(contract, getContractViewer(contract, account)),
      'contract.seller.disputeRaised': (contract: Contract) =>
        showDisputeRaisedNotice(contract, getContractViewer(contract, account)),
      // PN-D02 PN-D03
      'contract.disputeResolved': (contract: Contract) =>
        showDisputeResults(contract, getContractViewer(contract, account)),
      // PN-S13
      'contract.canceled': (contract: Contract) => showTradeCanceled(contract, false),
      // PN-S14
      'seller.canceledAfterEscrowExpiry': (contract: Contract) => showTradeCanceled(contract, false),
      // PN-B08
      'contract.cancelationRequest': (contract: Contract) =>
        !contract.disputeActive ? showConfirmTradeCancelation(contract) : null,
      // PN-S15
      'contract.cancelationRequestAccepted': (contract: Contract) => showTradeCanceled(contract, true),
      // PN-S16
      'contract.cancelationRequestRejected': (contract: Contract) => showCancelTradeRequestRejected(contract),
      // PN-B12
      'contract.buyer.paymentTimerHasRunOut': (contract: Contract, { contractId }: PNData) =>
        showPaymentTimerHasRunOut(contract, 'buyer', currentContractId === contractId),
      // PN-S12
      'contract.seller.paymentTimerHasRunOut': (contract: Contract, { contractId }: PNData) =>
        showPaymentTimerHasRunOut(contract, 'seller', currentContractId === contractId),
      // PN-B06
      'contract.buyer.paymentTimerSellerCanceled': (contract: Contract, { contractId }: PNData) =>
        showPaymentTimerSellerCanceled(contract, currentContractId === contractId),
      // PN-B07
      'contract.buyer.paymentTimerExtended': (contract: Contract, { contractId }: PNData) =>
        showPaymentTimerExtended(contract, currentContractId === contractId),
      // PN-B04
      'contract.buyer.paymentReminderSixHours': (contract: Contract, { contractId }: PNData) =>
        showPaymentReminder(contract, currentContractId === contractId),
      // PN-B05
      'contract.buyer.paymentReminderOneHour': (contract: Contract, { contractId }: PNData) =>
        showPaymentReminder(contract, currentContractId === contractId),
    }),
    [
      currentContractId,
      showCancelTradeRequestRejected,
      showConfirmTradeCancelation,
      showDisputeRaisedNotice,
      showDisputeResults,
      showPaymentReminder,
      showPaymentTimerExtended,
      showPaymentTimerHasRunOut,
      showPaymentTimerSellerCanceled,
      showTradeCanceled,
    ],
  )
  return contractPopupEvents
}
