import { fireEvent, render, responseUtils, waitFor } from 'test-utils'
import { peachAPI } from '../../utils/peachAPI'
import { RedeemNoPeachFeesPopup } from './RedeemNoPeachFeesPopup'

const showErrorBannerMock = jest.fn()
jest.mock('../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

const redeemNoPeachFeesMock = jest.spyOn(peachAPI.private.user, 'redeemNoPeachFees')
jest.useFakeTimers()

describe('RedeemNoPeachFeesPopup', () => {
  it('redeems reward successfully', async () => {
    const { getByText } = render(<RedeemNoPeachFeesPopup />)
    fireEvent.press(getByText('activate'))
    await waitFor(() => {
      expect(redeemNoPeachFeesMock).toHaveBeenCalled()
    })
  })
  it('show error banner if reward could not be redeemed', async () => {
    redeemNoPeachFeesMock.mockResolvedValueOnce({ error: { error: 'NOT_ENOUGH_POINTS' }, ...responseUtils })
    const { getByText } = render(<RedeemNoPeachFeesPopup />)
    fireEvent.press(getByText('activate'))
    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('NOT_ENOUGH_POINTS')
    })
  })
})
