import { isValidFeeRate } from './isValidFeeRate'

describe('isValidFeeRate', () => {
  it('should return true a valid fee rate', () => {
    expect(isValidFeeRate('123')).toBe(true)
    expect(isValidFeeRate('1')).toBe(true)
    expect(isValidFeeRate('1.4')).toBe(true)
  })
  it('should return false a fee rate below 1', () => {
    expect(isValidFeeRate('0.8')).toBe(false)
    expect(isValidFeeRate('0')).toBe(false)
    expect(isValidFeeRate('-1')).toBe(false)
    expect(isValidFeeRate('-1.5')).toBe(false)
  })
  it('should return false not a number', () => {
    expect(isValidFeeRate('a')).toBe(false)
    expect(isValidFeeRate('.')).toBe(false)
  })
})
