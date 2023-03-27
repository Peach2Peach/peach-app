import { isRewardAvailable } from './isRewardAvailable'

describe('isRewardAvailable', () => {
  it('returns true if reward is available', () => {
    const reward: Reward = {
      id: 'customReferralCode',
      requiredPoints: 100,
    }
    expect(isRewardAvailable(reward, 100)).toBe(true)
  })
  it('returns false if reward is not available', () => {
    const reward: Reward = {
      id: 'customReferralCode',
      requiredPoints: 100,
    }
    expect(isRewardAvailable(reward, 50)).toBe(false)
  })
  it('returns false if reward noPeachFees', () => {
    const reward: Reward = {
      id: 'noPeachFees',
      requiredPoints: 100,
    }
    expect(isRewardAvailable(reward, 200)).toBe(false)
  })
  it('returns false if reward sats', () => {
    const reward: Reward = {
      id: 'sats',
      requiredPoints: 100,
    }
    expect(isRewardAvailable(reward, 200)).toBe(false)
  })
})
