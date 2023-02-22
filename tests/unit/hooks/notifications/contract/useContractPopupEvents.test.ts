/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { act, renderHook } from '@testing-library/react-hooks'
import { useContractPopupEvents } from '../../../../../src/hooks/notifications/contract/useContractPopupEvents'
import Contract from '../../../../../src/views/contract/Contract'
import { contract } from '../../../data/contractData'

const showDisputeRaisedNoticeMock = jest.fn()
jest.mock('../../../../../src/overlays/dispute/hooks/useDisputeRaisedNotice', () => ({
  useDisputeRaisedNotice: () => showDisputeRaisedNoticeMock,
}))
const showDisputeResultsMock = jest.fn()
jest.mock('../../../../../src/overlays/dispute/hooks/useDisputeResults', () => ({
  useDisputeResults: () => showDisputeResultsMock,
}))
const showConfirmTradeCancelationMock = jest.fn()
jest.mock('../../../../../src/overlays/tradeCancelation/useConfirmTradeCancelationOverlay', () => ({
  useConfirmTradeCancelationOverlay: () => showConfirmTradeCancelationMock,
}))
const showTradeCanceledMock = jest.fn()
jest.mock('../../../../../src/overlays/tradeCancelation/useTradeCanceledOverlay', () => ({
  useTradeCanceledOverlay: () => showTradeCanceledMock,
}))
const showCancelTradeRequestRejectedMock = jest.fn()
jest.mock('../../../../../src/overlays/tradeCancelation/useBuyerRejectedCancelTradeOverlay', () => ({
  useBuyerRejectedCancelTradeOverlay: () => showCancelTradeRequestRejectedMock,
}))
const showPaymentTooLateOverlayMock = jest.fn()
jest.mock('../../../../../src/overlays/usePaymentTooLateOverlay', () => ({
  usePaymentTooLateOverlay: () => showPaymentTooLateOverlayMock,
}))
const showPaymentTimerHasRunOutMock = jest.fn()
jest.mock('../../../../../src/overlays/paymentTimer/useShowPaymentTimerHasRunOut', () => ({
  useShowPaymentTimerHasRunOut: () => showPaymentTimerHasRunOutMock,
}))
const showPaymentTimerSellerCanceledMock = jest.fn()
jest.mock('../../../../../src/overlays/paymentTimer/useShowPaymentTimerSellerCanceled', () => ({
  useShowPaymentTimerSellerCanceled: () => showPaymentTimerSellerCanceledMock,
}))
const showPaymentTimerExtendedMock = jest.fn()
jest.mock('../../../../../src/overlays/paymentTimer/useShowPaymentTimerExtended', () => ({
  useShowPaymentTimerExtended: () => showPaymentTimerExtendedMock,
}))

// eslint-disable-next-line max-lines-per-function
describe('useContractPopupEvents', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should handle "contract.buyer.disputeRaised" event', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current.contractPopupEvents['contract.buyer.disputeRaised']!(contract)
    })

    expect(showDisputeRaisedNoticeMock).toHaveBeenCalledWith(contract, expect.anything())
  })

  it('should handle "contract.seller.disputeRaised" event', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current.contractPopupEvents['contract.seller.disputeRaised']!(contract)
    })

    expect(showDisputeRaisedNoticeMock).toHaveBeenCalledWith(contract, expect.anything())
  })

  it('should handle "contract.disputeResolved" event', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current.contractPopupEvents['contract.disputeResolved']!(contract)
    })

    expect(showDisputeResultsMock).toHaveBeenCalledWith(contract, expect.anything())
  })

  it('should handle "contract.canceled" event', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current.contractPopupEvents['contract.canceled']!(contract)
    })

    expect(showTradeCanceledMock).toHaveBeenCalledWith(contract, false)
  })
  it('should handle "seller.canceledAfterEscrowExpiry" event', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current.contractPopupEvents['seller.canceledAfterEscrowExpiry']!(contract)
    })

    expect(showTradeCanceledMock).toHaveBeenCalledWith(contract, false)
  })

  it('should handle "contract.cancelationRequest" event when dispute is not active', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current.contractPopupEvents['contract.cancelationRequest']!(contract)
    })

    expect(showConfirmTradeCancelationMock).toHaveBeenCalledWith(contract)
  })

  it('should not handle "contract.cancelationRequest" event when dispute is active', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current.contractPopupEvents['contract.cancelationRequest']!({ ...contract, disputeActive: true })
    })

    expect(showConfirmTradeCancelationMock).not.toHaveBeenCalled()
  })

  it('should handle "contract.cancelationRequestAccepted" event', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current.contractPopupEvents['contract.cancelationRequestAccepted']!(contract)
    })

    expect(showTradeCanceledMock).toHaveBeenCalledWith(contract, true)
  })

  it('should handle "contract.cancelationRequestRejected" event', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current.contractPopupEvents['contract.cancelationRequestRejected']!(contract)
    })

    expect(showCancelTradeRequestRejectedMock).toHaveBeenCalledWith(contract)
  })

  it('should handle "contract.buyer.paymentTimerSellerCanceled" event', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current.contractPopupEvents['contract.buyer.paymentTimerSellerCanceled']!(contract)
    })

    expect(showPaymentTimerSellerCanceledMock).toHaveBeenCalledWith(contract, true)
  })

  it('should handle "contract.buyer.paymentTimerHasRunOut" event', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current.contractPopupEvents['contract.buyer.paymentTimerHasRunOut']!(contract)
    })

    expect(showPaymentTooLateOverlayMock).toHaveBeenCalled()
  })
  it('should handle "contract.seller.paymentTimerHasRunOut" event', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current.contractPopupEvents['contract.seller.paymentTimerHasRunOut']!(contract)
    })

    expect(showPaymentTimerHasRunOutMock).toHaveBeenCalledWith(contract, true)
  })
  it('should handle "contract.buyer.paymentTimerExtended" event', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current.contractPopupEvents['contract.buyer.paymentTimerExtended']!(contract)
    })

    expect(showPaymentTimerExtendedMock).toHaveBeenCalledWith(contract, true)
  })

  it('should not ingore global events when not viewing current contract', async () => {
    const { result } = renderHook(() => useContractPopupEvents())

    expect(result.current.ignoreGlobalEvent('contract.buyer.disputeRaised', '1', '2')).toBe(true)
    expect(result.current.ignoreGlobalEvent('contract.buyer.disputeRaised', '1', '1')).toBe(false)
    expect(result.current.ignoreGlobalEvent('contract.canceled', '1', '2')).toBe(false)
  })
})
