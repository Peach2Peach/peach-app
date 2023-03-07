import { isValidLength } from '../../../../src/utils/validation/isValidLength'

describe('isValidLength', () => {
  it('should return true for a number with the exact length specified as a number', () => {
    expect(isValidLength('123', 3)).toBe(true)
  })

  it('should return false for a number with a different length than the one specified as a number', () => {
    expect(isValidLength('123', 4)).toBe(false)
  })

  it('should return true for a number with a length within the specified range as an array', () => {
    expect(isValidLength('12', [2, 4])).toBe(true)
    expect(isValidLength('123', [2, 4])).toBe(true)
    expect(isValidLength('1234', [2, 4])).toBe(true)
  })

  it('should return false for a number with a length outside the specified range as an array', () => {
    expect(isValidLength('1', [2, 4])).toBe(false)
    expect(isValidLength('12345', [2, 4])).toBe(false)
  })
})
