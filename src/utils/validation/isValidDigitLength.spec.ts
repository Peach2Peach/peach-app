import { isValidDigitLength } from './isValidDigitLength'

describe('isValidDigitLength', () => {
  it('should return true for a number with the exact length specified as a number', () => {
    const str = '123'
    expect(isValidDigitLength(str, str.length)).toBe(true)
  })

  it('should return false for a number with a different length than the one specified as a number', () => {
    const str = '123'
    expect(isValidDigitLength(str, str.length + 1)).toBe(false)
  })

  it('should return true for a number with a length within the specified range as an array', () => {
    const str1 = '12'
    const str2 = '123'
    const str3 = '1234'
    expect(isValidDigitLength(str1, [str1.length, str3.length])).toBe(true)
    expect(isValidDigitLength(str2, [str1.length, str3.length])).toBe(true)
    expect(isValidDigitLength(str3, [str1.length, str3.length])).toBe(true)
  })

  it('should return false for a number with a length outside the specified range as an array', () => {
    const str1 = '1'
    const str2 = '12345'
    expect(isValidDigitLength(str1, [str1.length + 1, str2.length - 1])).toBe(false)
    expect(isValidDigitLength(str2, [str1.length + 1, str2.length - 1])).toBe(false)
  })
})
