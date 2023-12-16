import { renderHook } from 'test-utils'
import { sellOffer } from '../../tests/unit/data/offerData'
import { PopupLoadingSpinner } from '../../tests/unit/helpers/PopupLoadingSpinner'
import { PopupAction } from '../components/popup'
import { PopupComponent } from '../components/popup/PopupComponent'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { useCancelAndStartRefundPopup } from './useCancelAndStartRefundPopup'

const refundEscrowMock = jest.fn()
jest.mock('../hooks/useRefundEscrow', () => ({
  useRefundEscrow: () => refundEscrowMock,
}))

const showErrorMock = jest.fn()
jest.mock('../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorMock,
}))

describe('useCancelAndStartRefundPopup', () => {
  beforeEach(() => {
    usePopupStore.setState(defaultPopupState)
  })
  it('should return a function', () => {
    const { result } = renderHook(useCancelAndStartRefundPopup)
    expect(result.current).toBeInstanceOf(Function)
  })

  it('should show the loading popup and start refund', async () => {
    const { result } = renderHook(useCancelAndStartRefundPopup)
    await result.current(sellOffer)
    expect(usePopupStore.getState().visible).toBe(true)
    expect(usePopupStore.getState().popupComponent).toEqual(
      <PopupComponent
        title="refunding escrow"
        content={PopupLoadingSpinner}
        actions={<PopupAction label="loading..." iconId="clock" onPress={expect.any(Function)} />}
      />,
    )
    expect(refundEscrowMock).toHaveBeenCalledWith(sellOffer, 'psbt')
  })
})
