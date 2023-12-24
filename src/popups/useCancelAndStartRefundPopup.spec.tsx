import { render, renderHook } from 'test-utils'
import { sellOffer } from '../../tests/unit/data/offerData'
import { Popup } from '../components/popup'
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
  it('should return a function', () => {
    const { result } = renderHook(useCancelAndStartRefundPopup)
    expect(result.current).toBeInstanceOf(Function)
  })

  it('should show the loading popup and start refund', async () => {
    const { result } = renderHook(useCancelAndStartRefundPopup)
    await result.current(sellOffer)
    const { queryByText } = render(<Popup />)
    expect(queryByText('refunding escrow')).toBeTruthy()
    expect(refundEscrowMock).toHaveBeenCalledWith(sellOffer, 'psbt')
  })
})
