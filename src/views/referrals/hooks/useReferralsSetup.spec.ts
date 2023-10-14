/* eslint-disable max-lines-per-function */
import { act, renderHook } from 'test-utils'
import { defaultSelfUser } from '../../../../tests/unit/data/userData'
import { useSelfUser } from '../../../hooks/query/useSelfUser'
import { useReferralsSetup } from './useReferralsSetup'

jest.mock('../../../hooks/query/useSelfUser', () => ({
  useSelfUser: jest.fn(),
}))

const setCustomReferralCodePopupMock = jest.fn()
const useSetCustomReferralCodePopupMock = jest.fn().mockReturnValue({
  setCustomReferralCodePopup: setCustomReferralCodePopupMock,
})
jest.mock('../../../popups/referral/useSetCustomReferralCodePopup', () => ({
  useSetCustomReferralCodePopup: () => useSetCustomReferralCodePopupMock(),
}))
const redeemNoPeachFeesReward = jest.fn()
const useRedeemNoPeachFeesRewardMock = jest.fn().mockReturnValue(redeemNoPeachFeesReward)
jest.mock('../../../popups/referral/useRedeemNoPeachFeesReward', () => ({
  useRedeemNoPeachFeesReward: () => useRedeemNoPeachFeesRewardMock(),
}))

describe('useReferralsSetup', () => {
  beforeEach(() => {
    (useSelfUser as jest.Mock).mockReturnValue({
      user: defaultSelfUser,
    })
  })
  it('returns default correct values', () => {
    const { result } = renderHook(useReferralsSetup)

    expect(result.current.user).toEqual(defaultSelfUser)
    expect(result.current.pointsBalance).toEqual(defaultSelfUser.bonusPoints)
    expect(result.current.availableRewards).toEqual(0)
    expect(result.current.selectedReward).toBeUndefined()
    expect(result.current.setSelectedReward).toBeDefined()
    expect(result.current.redeem).toBeDefined()
  })

  it('returns correct bonus points and available rewards', () => {
    const bonusPoints = 400
    ;(useSelfUser as jest.Mock).mockReturnValue({
      user: {
        ...defaultSelfUser,
        bonusPoints,
      },
    })
    const { result } = renderHook(useReferralsSetup)

    expect(result.current.pointsBalance).toEqual(bonusPoints)
    expect(result.current.availableRewards).toEqual(2)
  })
  it('returns 0 bonus points balance if user data cannot be fetched', () => {
    (useSelfUser as jest.Mock).mockReturnValue({
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
        ...defaultSelfUser,
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
  it('does not let user start redemption of an unavailable reward', () => {
    const { result } = renderHook(useReferralsSetup)

    act(() => {
      result.current.setSelectedReward('sats')
      result.current.redeem()
    })

    expect(setCustomReferralCodePopupMock).not.toHaveBeenCalled()
  })
  it('lets user start redemption of a custom referral code', () => {
    const { result } = renderHook(useReferralsSetup)

    act(() => {
      result.current.setSelectedReward('customReferralCode')
    })
    act(() => {
      result.current.redeem()
    })

    expect(setCustomReferralCodePopupMock).toHaveBeenCalled()
  })
  it('lets user start redemption of a no peach fees', () => {
    const { result } = renderHook(useReferralsSetup)

    act(() => {
      result.current.setSelectedReward('noPeachFees')
    })

    act(() => {
      result.current.redeem()
    })

    expect(redeemNoPeachFeesReward).toHaveBeenCalled()
  })
})
