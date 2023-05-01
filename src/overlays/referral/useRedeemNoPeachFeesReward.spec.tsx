import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper, replaceMock } from '../../../tests/unit/helpers/NavigationWrapper'
import { OverlayContext, defaultOverlay } from '../../contexts/overlay'
import { NoPeachFees } from './NoPeachFees'
import { useRedeemNoPeachFeesReward } from './useRedeemNoPeachFeesReward'
import { NoPeachFeesSuccess } from './NoPeachFeesSuccess'

const showErrorBannerMock = jest.fn()
const useShowErrorBannerMock = jest.fn().mockReturnValue(showErrorBannerMock)
jest.mock('../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => useShowErrorBannerMock(),
}))

const apiSuccess = { success: true, bonusPoints: 10 }
const apiError = { error: 'NOT_ENOUGH_POINTS' }
const redeemNoPeachFeesMock = jest.fn().mockResolvedValue([apiSuccess])
jest.mock('../../utils/peachAPI', () => ({
  redeemNoPeachFees: () => redeemNoPeachFeesMock(),
}))

describe('useRedeemNoPeachFeesReward', () => {
  let overlayState = { ...defaultOverlay }
  const updateOverlay = jest.fn((newState) => (overlayState = newState))
  const wrapper = ({ children }: ComponentProps) => (
    <NavigationWrapper>
      <OverlayContext.Provider value={[overlayState, updateOverlay]}>{children}</OverlayContext.Provider>
    </NavigationWrapper>
  )

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('returns function to start setCustomReferralCodeOverlay', () => {
    const { result } = renderHook(useRedeemNoPeachFeesReward, { wrapper })
    expect(result.current).toBeInstanceOf(Function)
  })
  it('opens popup to redeem reward', () => {
    const { result } = renderHook(useRedeemNoPeachFeesReward, { wrapper })
    result.current()
    expect(overlayState).toEqual({
      title: '5x no peach fees',
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
  it('closes popup', async () => {
    const { result } = renderHook(useRedeemNoPeachFeesReward, { wrapper })
    result.current()
    await overlayState.action2?.callback()
    expect(overlayState).toEqual({ visible: false })
  })
  it('redeems reward successfully', async () => {
    const { result } = renderHook(useRedeemNoPeachFeesReward, { wrapper })
    result.current()
    await overlayState.action1?.callback()
    expect(redeemNoPeachFeesMock).toHaveBeenCalled()
    expect(overlayState).toEqual({
      title: '5x no peach fees',
      content: <NoPeachFeesSuccess />,
      level: 'APP',
      visible: true,
    })
    expect(replaceMock).toHaveBeenCalledWith('referrals')
  })
  it('show error banner if reward could not be redeemed', async () => {
    redeemNoPeachFeesMock.mockResolvedValueOnce([null, apiError])
    const { result } = renderHook(useRedeemNoPeachFeesReward, { wrapper })
    result.current()
    await overlayState.action1?.callback()
    expect(showErrorBannerMock).toHaveBeenCalledWith(apiError.error)
  })
})
