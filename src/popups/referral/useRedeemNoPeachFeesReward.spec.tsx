import { renderHook, responseUtils, waitFor } from 'test-utils'
import { replaceMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { usePopupStore } from '../../store/usePopupStore'
import { peachAPI } from '../../utils/peachAPI'
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
    expect(usePopupStore.getState()).toEqual(
      expect.objectContaining({
        title: '2x free trades',
        content: <NoPeachFees />,
        level: 'APP',
        visible: true,
        action1: {
          label: 'activate',
          icon: 'checkSquare',
          callback: expect.any(Function),
        },
        action2: {
          label: 'close',
          icon: 'xSquare',
          callback: expect.any(Function),
        },
      }),
    )
  })
  it('closes popup', () => {
    const { result } = renderHook(useRedeemNoPeachFeesReward)
    result.current()
    usePopupStore.getState().action2?.callback()
    expect(usePopupStore.getState().visible).toEqual(false)
  })
  it('redeems reward successfully', async () => {
    const { result } = renderHook(useRedeemNoPeachFeesReward)
    result.current()
    usePopupStore.getState().action1?.callback()
    expect(redeemNoPeachFeesMock).toHaveBeenCalled()
    await waitFor(() => {
      expect(usePopupStore.getState()).toEqual(
        expect.objectContaining({
          title: '2x free trades',
          content: <NoPeachFeesSuccess />,
          level: 'APP',
          visible: true,
        }),
      )
    })
    expect(replaceMock).toHaveBeenCalledWith('referrals')
  })
  it('show error banner if reward could not be redeemed', async () => {
    redeemNoPeachFeesMock.mockResolvedValueOnce({ error: { error: 'NOT_ENOUGH_POINTS' }, ...responseUtils })
    const { result } = renderHook(useRedeemNoPeachFeesReward)
    result.current()
    usePopupStore.getState().action1?.callback()
    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('NOT_ENOUGH_POINTS')
    })
  })
})
