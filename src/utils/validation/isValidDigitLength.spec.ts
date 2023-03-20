import { isValidDigitLength } from './isValidDigitLength'

describe('isValidDigitLength', () => {
  it('should return true for a number with the exact length specified as a number', () => {
    expect(isValidDigitLength('123', 3)).toBe(true)
  })

  it('should return false for a number with a different length than the one specified as a number', () => {
    expect(isValidDigitLength('123', 4)).toBe(false)
  })

  it('should return true for a number with a length within the specified range as an array', () => {
    expect(isValidDigitLength('12', [2, 4])).toBe(true)
    expect(isValidDigitLength('123', [2, 4])).toBe(true)
    expect(isValidDigitLength('1234', [2, 4])).toBe(true)
  })

  it('should return false for a number with a length outside the specified range as an array', () => {
    expect(isValidDigitLength('1', [2, 4])).toBe(false)
    expect(isValidDigitLength('12345', [2, 4])).toBe(false)
  })
})
