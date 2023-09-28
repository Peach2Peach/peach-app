import { renderHook, waitFor } from '@testing-library/react-native'
import { notEnoughPointsError } from '../../../tests/unit/data/peachAPIData'
import { NavigationWrapper, replaceMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { usePopupStore } from '../../store/usePopupStore'
import { NoPeachFees } from './NoPeachFees'
import { NoPeachFeesSuccess } from './NoPeachFeesSuccess'
import { useRedeemNoPeachFeesReward } from './useRedeemNoPeachFeesReward'

const showErrorBannerMock = jest.fn()
const useShowErrorBannerMock = jest.fn().mockReturnValue(showErrorBannerMock)
jest.mock('../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => useShowErrorBannerMock(),
}))

const apiSuccess = { success: true, bonusPoints: 10 }
const redeemNoPeachFeesMock = jest.fn().mockResolvedValue([apiSuccess])
jest.mock('../../utils/peachAPI', () => ({
  redeemNoPeachFees: () => redeemNoPeachFeesMock(),
}))

describe('useRedeemNoPeachFeesReward', () => {
  const wrapper = NavigationWrapper

  it('returns function to start setCustomReferralCodePopup', () => {
    const { result } = renderHook(useRedeemNoPeachFeesReward, { wrapper })
    expect(result.current).toBeInstanceOf(Function)
  })
  it('opens popup to redeem reward', () => {
    const { result } = renderHook(useRedeemNoPeachFeesReward, { wrapper })
    result.current()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: '5x free trading',
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
    })
  })
  it('closes popup', () => {
    const { result } = renderHook(useRedeemNoPeachFeesReward, { wrapper })
    result.current()
    usePopupStore.getState().action2?.callback()
    expect(usePopupStore.getState().visible).toEqual(false)
  })
  it('redeems reward successfully', async () => {
    const { result } = renderHook(useRedeemNoPeachFeesReward, { wrapper })
    result.current()
    usePopupStore.getState().action1?.callback()
    expect(redeemNoPeachFeesMock).toHaveBeenCalled()
    await waitFor(() => {
      expect(usePopupStore.getState()).toEqual({
        ...usePopupStore.getState(),
        title: '2x free trading',
        content: <NoPeachFeesSuccess />,
        level: 'APP',
        visible: true,
      })
    })
    expect(replaceMock).toHaveBeenCalledWith('referrals')
  })
  it('show error banner if reward could not be redeemed', async () => {
    redeemNoPeachFeesMock.mockResolvedValueOnce([null, notEnoughPointsError])
    const { result } = renderHook(useRedeemNoPeachFeesReward, { wrapper })
    result.current()
    usePopupStore.getState().action1?.callback()
    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith(notEnoughPointsError.error)
    })
  })
})
