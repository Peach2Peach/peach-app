import { isUKSortCode } from './isUKSortCode'

describe('isUKSortCode', () => {
  it('should return true for a valid UK sort code', () => {
    expect(isUKSortCode('123456')).toBe(true)
  })

  it('should return false for an invalid UK sort code', () => {
    expect(isUKSortCode('123')).toBe(false)
    expect(isUKSortCode('123123123')).toBe(false)
    expect(isUKSortCode('abc123')).toBe(false)
  })

  it('should return false for an empty string', () => {
    expect(isUKSortCode('')).toBe(false)
  })
})
