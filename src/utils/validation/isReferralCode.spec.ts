import { isReferralCode } from './isReferralCode'

describe('isReferralCode', () => {
  it('should return true for a valid referral code', () => {
    expect(isReferralCode('PR0043')).toBe(true)
    expect(isReferralCode('SATOSHI')).toBe(true)
  })

  it('should return false for an empty referral code', () => {
    expect(isReferralCode('')).toBe(false)
  })
  it('should return false for an invalid referral code', () => {
    expect(isReferralCode('ABC')).toBe(false)
    expect(isReferralCode('ABCDEFGHIJKLMNOPQ')).toBe(false)
    expect(isReferralCode('@CRAIGWRONG')).toBe(false)
  })
})
