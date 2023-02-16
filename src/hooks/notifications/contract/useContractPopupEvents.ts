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
      'contract.buyer.disputeRaised': (contract: Contract) =>
        showDisputeRaisedNotice(contract, getContractViewer(contract, account)),
      'contract.seller.disputeRaised': (contract: Contract) =>
        showDisputeRaisedNotice(contract, getContractViewer(contract, account)),
      'contract.disputeResolved': (contract: Contract) =>
        showDisputeResults(contract, getContractViewer(contract, account)),
      'contract.canceled': (contract: Contract) => showTradeCanceled(contract, false),
      'contract.cancelationRequest': (contract: Contract) =>
        !contract.disputeActive ? showConfirmTradeCancelation(contract) : null,
      'contract.cancelationRequestAccepted': (contract: Contract) => showTradeCanceled(contract, true),
      'contract.cancelationRequestRejected': (contract: Contract) => showCancelTradeRequestRejected(contract),
      'contract.buyer.paymentTimerHasRunOut': (contract: Contract, { contractId }: PNData) =>
        showPaymentTimerHasRunOut(contract, 'buyer', currentContractId === contractId),
      'contract.seller.paymentTimerHasRunOut': (contract: Contract, { contractId }: PNData) =>
        showPaymentTimerHasRunOut(contract, 'seller', currentContractId === contractId),
      'contract.buyer.paymentTimerSellerCanceled': (contract: Contract, { contractId }: PNData) =>
        showPaymentTimerSellerCanceled(contract, currentContractId === contractId),
      'contract.buyer.paymentTimerExtended': (contract: Contract, { contractId }: PNData) =>
        showPaymentTimerExtended(contract, currentContractId === contractId),
      'contract.buyer.paymentReminderSixHours': (contract: Contract, { contractId }: PNData) =>
        showPaymentReminder(contract, currentContractId === contractId),
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
