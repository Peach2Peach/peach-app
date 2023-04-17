/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { act, renderHook } from '@testing-library/react-native'
import { useContractPopupEvents } from './useContractPopupEvents'
import { contract } from '../../../../../tests/unit/data/contractData'

const showConfirmTradeCancelationMock = jest.fn()
jest.mock('../../../../overlays/tradeCancelation/useConfirmTradeCancelationOverlay', () => ({
  useConfirmTradeCancelationOverlay: () => ({
    showConfirmTradeCancelation: showConfirmTradeCancelationMock,
  }),
}))
const showTradeCanceledMock = jest.fn()
jest.mock('../../../../overlays/tradeCancelation/useTradeCanceledOverlay', () => ({
  useTradeCanceledOverlay: () => ({
    showTradeCanceled: showTradeCanceledMock,
  }),
}))
const showPaymentTooLateOverlayMock = jest.fn()
jest.mock('../../../../overlays/usePaymentTooLateOverlay', () => ({
  usePaymentTooLateOverlay: () => showPaymentTooLateOverlayMock,
}))

describe('useContractPopupEvents', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should handle "contract.canceled" event', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current['contract.canceled']!(contract)
    })

    expect(showTradeCanceledMock).toHaveBeenCalledWith(contract, false)
  })
  it('should handle "seller.canceledAfterEscrowExpiry" event', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current['seller.canceledAfterEscrowExpiry']!(contract)
    })

    expect(showTradeCanceledMock).toHaveBeenCalledWith(contract, false)
  })
  it('should handle "contract.cancelationRequest" event if dispute is not active', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current['contract.cancelationRequest']!({ ...contract, disputeActive: false })
    })

    expect(showConfirmTradeCancelationMock).toHaveBeenCalledWith(contract)
  })
  it('should not handle "contract.cancelationRequest" event if dispute is active', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current['contract.cancelationRequest']!({ ...contract, disputeActive: true })
    })

    expect(showConfirmTradeCancelationMock).not.toHaveBeenCalled()
  })
  it('should handle "contract.buyer.paymentTimerHasRunOut" event', () => {
    const { result } = renderHook(() => useContractPopupEvents())

    act(() => {
      result.current['contract.buyer.paymentTimerHasRunOut']!(contract)
    })

    expect(showPaymentTooLateOverlayMock).toHaveBeenCalled()
  })
})
