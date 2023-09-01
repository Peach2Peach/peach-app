import { isNUBAN } from './isNUBAN'

describe('isNUBAN', () => {
  it('should return true for valid NUBAN', () => {
    expect(isNUBAN('0000014579')).toBe(true)
  })
  it('should return false for invalid NUBAN', () => {
    expect(!isNUBAN('000001457')).toBe(true)
  })
})
