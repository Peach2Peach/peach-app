/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { act, renderHook } from '@testing-library/react-hooks'
import { useContractPopupEvents } from '../../../../../src/hooks/notifications/contract/useContractPopupEvents'
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
  const currentContractId = '123-456'
  const data = { contractId: currentContractId } as PNData

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should handle "contract.buyer.disputeRaised" event', () => {
    const { result } = renderHook(() => useContractPopupEvents(currentContractId))

    act(() => {
      result.current['contract.buyer.disputeRaised']!(contract, data)
    })

    expect(showDisputeRaisedNoticeMock).toHaveBeenCalledWith(contract, expect.anything())
  })

  it('should handle "contract.seller.disputeRaised" event', () => {
    const { result } = renderHook(() => useContractPopupEvents(currentContractId))

    act(() => {
      result.current['contract.seller.disputeRaised']!(contract, data)
    })

    expect(showDisputeRaisedNoticeMock).toHaveBeenCalledWith(contract, expect.anything())
  })

  it('should handle "contract.disputeResolved" event', () => {
    const { result } = renderHook(() => useContractPopupEvents(currentContractId))

    act(() => {
      result.current['contract.disputeResolved']!(contract, data)
    })

    expect(showDisputeResultsMock).toHaveBeenCalledWith(contract, expect.anything())
  })

  it('should handle "contract.canceled" event', () => {
    const { result } = renderHook(() => useContractPopupEvents(currentContractId))

    act(() => {
      result.current['contract.canceled']!(contract, data)
    })

    expect(showTradeCanceledMock).toHaveBeenCalledWith(contract, false)
  })
  it('should handle "seller.canceledAfterEscrowExpiry" event', () => {
    const { result } = renderHook(() => useContractPopupEvents(currentContractId))

    act(() => {
      result.current['seller.canceledAfterEscrowExpiry']!(contract, data)
    })

    expect(showTradeCanceledMock).toHaveBeenCalledWith(contract, false)
  })

  it('should handle "contract.cancelationRequest" event when dispute is not active', () => {
    const { result } = renderHook(() => useContractPopupEvents(currentContractId))

    act(() => {
      result.current['contract.cancelationRequest']!(contract, data)
    })

    expect(showConfirmTradeCancelationMock).toHaveBeenCalledWith(contract)
  })

  it('should not handle "contract.cancelationRequest" event when dispute is active', () => {
    const { result } = renderHook(() => useContractPopupEvents(currentContractId))

    act(() => {
      result.current['contract.cancelationRequest']!({ ...contract, disputeActive: true }, data)
    })

    expect(showConfirmTradeCancelationMock).not.toHaveBeenCalled()
  })

  it('should handle "contract.cancelationRequestAccepted" event', () => {
    const { result } = renderHook(() => useContractPopupEvents(currentContractId))

    act(() => {
      result.current['contract.cancelationRequestAccepted']!(contract, data)
    })

    expect(showTradeCanceledMock).toHaveBeenCalledWith(contract, true)
  })

  it('should handle "contract.cancelationRequestRejected" event', () => {
    const { result } = renderHook(() => useContractPopupEvents(currentContractId))

    act(() => {
      result.current['contract.cancelationRequestRejected']!(contract, data)
    })

    expect(showCancelTradeRequestRejectedMock).toHaveBeenCalledWith(contract)
  })

  it('should call showPaymentTimerSellerCanceled when currentContractId matches', () => {
    const { result } = renderHook(() => useContractPopupEvents(currentContractId))

    act(() => {
      result.current['contract.buyer.paymentTimerSellerCanceled']!(contract, data)
    })

    expect(showPaymentTimerSellerCanceledMock).toHaveBeenCalledWith(contract, true)
  })
  it('should call paymentTimerHasRunOut for buyer', () => {
    const { result } = renderHook(() => useContractPopupEvents(currentContractId))

    act(() => {
      result.current['contract.buyer.paymentTimerHasRunOut']!(contract, data)
    })

    expect(showPaymentTimerHasRunOutMock).toHaveBeenCalledWith(contract, 'buyer', true)
  })
  it('should call paymentTimerHasRunOut for seller', () => {
    const { result } = renderHook(() => useContractPopupEvents(currentContractId))

    act(() => {
      result.current['contract.seller.paymentTimerHasRunOut']!(contract, data)
    })

    expect(showPaymentTimerHasRunOutMock).toHaveBeenCalledWith(contract, 'seller', true)
  })

  it('should call showPaymentTimerExtended when currentContractId matches', () => {
    const { result } = renderHook(() => useContractPopupEvents(currentContractId))

    act(() => {
      result.current['contract.buyer.paymentTimerExtended']!(contract, data)
    })

    expect(showPaymentTimerExtendedMock).toHaveBeenCalledWith(contract, true)
  })
})
