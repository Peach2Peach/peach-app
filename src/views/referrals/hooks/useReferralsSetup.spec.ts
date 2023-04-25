/* eslint-disable max-lines-per-function */
import { act, renderHook } from '@testing-library/react-native'
import { defaultPrivateUser } from '../../../../tests/unit/data/userData'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useSetCustomReferralCodeOverlay } from '../../../overlays/referral/useSetCustomReferralCodeOverlay'
import { useReferralsSetup } from './useReferralsSetup'

jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: jest.fn(),
  }),
}))
jest.mock('../../../hooks/useHeaderSetup', () => ({
  useHeaderSetup: jest.fn(),
}))

jest.mock('../../../hooks/query/useSelfUser', () => ({
  useSelfUser: jest.fn(),
}))
jest.mock('../../../overlays/referral/useSetCustomReferralCodeOverlay', () => ({
  useSetCustomReferralCodeOverlay: jest.fn(),
}))

describe('useReferralsSetup', () => {
  const setCustomReferralCodeOverlayMock = jest.fn()
  beforeEach(() => {
    ;(useSetCustomReferralCodeOverlay as jest.Mock).mockReturnValue({
      setCustomReferralCodeOverlay: setCustomReferralCodeOverlayMock,
    })
    ;(useSelfUser as jest.Mock).mockReturnValue({
      user: defaultPrivateUser,
    })
  })
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('returns default correct values', () => {
    const { result } = renderHook(useReferralsSetup)

    expect(result.current.user).toEqual(defaultPrivateUser)
    expect(result.current.BARLIMIT).toBeGreaterThan(0)
    expect(result.current.REWARDINFO[0]).toHaveProperty('id')
    expect(result.current.REWARDINFO[0]).toHaveProperty('requiredPoints')
    expect(result.current.pointsBalance).toEqual(defaultPrivateUser.bonusPoints)
    expect(result.current.availableRewards).toEqual(0)
    expect(result.current.selectedReward).toBeUndefined()
    expect(result.current.setSelectedReward).toBeDefined()
    expect(result.current.redeem).toBeDefined()
  })

  it('returns correct bonus points and available rewards', () => {
    const bonusPoints = 400
    ;(useSelfUser as jest.Mock).mockReturnValue({
      user: {
        ...defaultPrivateUser,
        bonusPoints,
      },
    })
    const { result } = renderHook(useReferralsSetup)

    expect(result.current.pointsBalance).toEqual(bonusPoints)
    expect(result.current.availableRewards).toEqual(1)
  })
  it('returns 0 bonus points balance if user data cannot be fetched', () => {
    ;(useSelfUser as jest.Mock).mockReturnValue({
      user: undefined,
    })
    const { result } = renderHook(useReferralsSetup)

    expect(result.current.pointsBalance).toEqual(0)
    expect(result.current.availableRewards).toEqual(0)
  })
  it('lets user select a reward', () => {
    const bonusPoints = 400
    ;(useSelfUser as jest.Mock).mockReturnValue({
      user: {
        ...defaultPrivateUser,
        bonusPoints,
      },
    })
    const { result } = renderHook(useReferralsSetup)

    expect(result.current.selectedReward).toBeUndefined()

    act(() => {
      result.current.setSelectedReward('customReferralCode')
    })
    expect(result.current.selectedReward).toEqual('customReferralCode')
  })
  it('lets does not let user start redemption of an unavailable reward', () => {
    const { result } = renderHook(useReferralsSetup)

    act(() => {
      result.current.setSelectedReward('noPeachFees')
      result.current.redeem()
    })

    expect(setCustomReferralCodeOverlayMock).not.toHaveBeenCalled()

    act(() => {
      result.current.setSelectedReward('sats')
      result.current.redeem()
    })

    expect(setCustomReferralCodeOverlayMock).not.toHaveBeenCalled()
  })
  it('lets user start redemption of a reward', () => {
    const { result } = renderHook(useReferralsSetup)

    act(() => {
      result.current.setSelectedReward('customReferralCode')
    })
    act(() => {
      result.current.redeem()
    })

    expect(setCustomReferralCodeOverlayMock).toHaveBeenCalled()
  })
})
