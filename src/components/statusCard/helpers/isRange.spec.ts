import { isRange } from './isRange'

describe('isRange', () => {
  it('should return true if the amount is a range', () => {
    const props = {
      amount: [1, 2] satisfies [number, number],
    }
    expect(isRange(props)).toBe(true)
  })
  it('should return false if the amount is not a range', () => {
    const props = {}
    expect(isRange(props)).toBe(false)
  })
})
