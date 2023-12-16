import { fireEvent, render, renderHook, responseUtils, waitFor } from 'test-utils'
import { replaceMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { Popup, PopupAction } from '../../components/popup'
import { PopupComponent } from '../../components/popup/PopupComponent'
import { usePopupStore } from '../../store/usePopupStore'
import { peachAPI } from '../../utils/peachAPI'
import { ClosePopupAction } from '../actions'
import { NoPeachFees } from './NoPeachFees'
import { NoPeachFeesSuccess } from './NoPeachFeesSuccess'
import { useRedeemNoPeachFeesReward } from './useRedeemNoPeachFeesReward'

const showErrorBannerMock = jest.fn()
jest.mock('../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

const redeemNoPeachFeesMock = jest.spyOn(peachAPI.private.user, 'redeemNoPeachFees')

describe('useRedeemNoPeachFeesReward', () => {
  it('returns function to start setCustomReferralCodePopup', () => {
    const { result } = renderHook(useRedeemNoPeachFeesReward)
    expect(result.current).toBeInstanceOf(Function)
  })
  it('opens popup to redeem reward', () => {
    const { result } = renderHook(useRedeemNoPeachFeesReward)
    result.current()

    expect(usePopupStore.getState().visible).toEqual(true)
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <PopupComponent
        title="2x free trades"
        content={<NoPeachFees />}
        actions={
          <>
            <ClosePopupAction />
            <PopupAction label="activate" iconId="checkSquare" onPress={expect.any(Function)} reverseOrder />
          </>
        }
      />,
    )
  })
  it('closes popup', () => {
    const { result } = renderHook(useRedeemNoPeachFeesReward)
    result.current()
    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('close'))
    expect(usePopupStore.getState().visible).toEqual(false)
  })
  it('redeems reward successfully', async () => {
    const { result } = renderHook(useRedeemNoPeachFeesReward)
    result.current()
    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('activate'))
    expect(redeemNoPeachFeesMock).toHaveBeenCalled()
    await waitFor(() => {
      expect(usePopupStore.getState().popupComponent).toStrictEqual(
        <PopupComponent
          title="2x free trades"
          content={<NoPeachFeesSuccess />}
          actions={<ClosePopupAction style={{ justifyContent: 'center' }} />}
        />,
      )
    })
    expect(replaceMock).toHaveBeenCalledWith('referrals')
  })
  it('show error banner if reward could not be redeemed', async () => {
    redeemNoPeachFeesMock.mockResolvedValueOnce({ error: { error: 'NOT_ENOUGH_POINTS' }, ...responseUtils })
    const { result } = renderHook(useRedeemNoPeachFeesReward)
    result.current()
    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('activate'))
    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('NOT_ENOUGH_POINTS')
    })
  })
})
