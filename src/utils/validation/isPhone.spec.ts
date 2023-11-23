import { isPhone } from './isPhone'

describe('isPhone', () => {
  it('should return true for a valid phone number', () => {
    expect(isPhone('+1234567890')).toBe(true)
  })

  it('should return false for an invalid phone number', () => {
    expect(isPhone('1234567890')).toBe(false)
  })

  it('should return false for an empty phone number', () => {
    expect(isPhone('')).toBe(false)
  })
})
