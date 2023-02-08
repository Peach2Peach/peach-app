import { isValueWithinRange } from '../../../../src/utils/math'

describe('isValueWithinRange', () => {
  it('should return true when value is within limits', () => {
    expect(isValueWithinRange(100, [1, 100])).toEqual(true)
  })

  it('should return false when value is greater than maximum limit', () => {
    expect(isValueWithinRange(101, [0, 30])).toEqual(false)
  })

  it('should return false when value is less than minimum limit', () => {
    expect(isValueWithinRange(-10, [-4, 10])).toEqual(false)
  })
})
