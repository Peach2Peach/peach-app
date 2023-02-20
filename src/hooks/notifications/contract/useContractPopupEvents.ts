import { useCallback, useMemo } from 'react'
import { useDisputeRaisedNotice } from '../../../overlays/dispute/hooks/useDisputeRaisedNotice'
import { useDisputeResults } from '../../../overlays/dispute/hooks/useDisputeResults'
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

const contractIgnoreGlobalEvents: NotificationType[] = [
  'contract.buyer.disputeRaised',
  'contract.seller.disputeRaised',
  'contract.cancelationRequestAccepted',
  'contract.cancelationRequestRejected',
  'contract.seller.paymentTimerHasRunOut',
  'contract.buyer.paymentTimerSellerCanceled',
  'contract.buyer.paymentTimerExtended',
]

export const useContractPopupEvents = (currentContractId?: string) => {
  const showDisputeRaisedNotice = useDisputeRaisedNotice()
  const showDisputeResults = useDisputeResults()

  const showConfirmTradeCancelation = useConfirmTradeCancelationOverlay()
  const showTradeCanceled = useTradeCanceledOverlay()
  const showCancelTradeRequestRejected = useBuyerRejectedCancelTradeOverlay()

  const showPaymentTimerHasRunOut = useShowPaymentTimerHasRunOut()
  const showPaymentTimerSellerCanceled = useShowPaymentTimerSellerCanceled()
  const showPaymentTimerExtended = useShowPaymentTimerExtended()

  const contractPopupEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-D01
      'contract.buyer.disputeRaised': (contract: Contract, { contractId }: PNData) =>
        showDisputeRaisedNotice(contract, getContractViewer(contract, account)),
      'contract.seller.disputeRaised': (contract: Contract, { contractId }: PNData) =>
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
      'contract.seller.paymentTimerHasRunOut': (contract: Contract) =>
        showPaymentTimerHasRunOut(contract, 'seller', true),
      // PN-B06
      'contract.buyer.paymentTimerSellerCanceled': (contract: Contract) =>
        showPaymentTimerSellerCanceled(contract, true),
      // PN-B07
      'contract.buyer.paymentTimerExtended': (contract: Contract) => showPaymentTimerExtended(contract, true),
    }),
    [
      currentContractId,
      showCancelTradeRequestRejected,
      showConfirmTradeCancelation,
      showDisputeRaisedNotice,
      showDisputeResults,
      showPaymentTimerExtended,
      showPaymentTimerHasRunOut,
      showPaymentTimerSellerCanceled,
      showTradeCanceled,
    ],
  )

  const ignoreGlobalEvent = useCallback(
    (contract: Contract, contractId: string, type: NotificationType) =>
      contract.id !== contractId && contractIgnoreGlobalEvents.includes(type),
    [],
  )

  return {
    contractPopupEvents,
    ignoreGlobalEvent,
  }
}
