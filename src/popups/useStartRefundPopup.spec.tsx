import { renderHook } from 'test-utils'
import { sellOffer } from '../../tests/unit/data/offerData'
import { PopupLoadingSpinner } from '../../tests/unit/helpers/PopupLoadingSpinner'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { useStartRefundPopup } from './useStartRefundPopup'

const refundEscrowMock = jest.fn()
jest.mock('../hooks/useRefundEscrow', () => ({
  useRefundEscrow: () => refundEscrowMock,
}))

const psbt = 'psbt'

const showErrorMock = jest.fn()
jest.mock('../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorMock,
}))

jest.useFakeTimers()

describe('useStartRefundPopup', () => {
  beforeEach(() => {
    usePopupStore.setState(defaultPopupState)
  })
  it('should return a function', () => {
    const { result } = renderHook(useStartRefundPopup)
    expect(result.current).toBeInstanceOf(Function)
  })

  it('should show the loading popup and start refund', async () => {
    const { result } = renderHook(useStartRefundPopup)
    await result.current(sellOffer)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'refunding escrow',
      content: PopupLoadingSpinner,
      visible: true,
      level: 'APP',
      requireUserAction: true,
      action1: {
        label: 'loading...',
        icon: 'clock',
        callback: expect.any(Function),
      },
    })
    expect(refundEscrowMock).toHaveBeenCalledWith(sellOffer, psbt)
  })
})
