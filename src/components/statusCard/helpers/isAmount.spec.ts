import { isAmount } from './isAmount'

describe('isAmount', () => {
  it('should return true if the amount is a number', () => {
    const props = {
      amount: 1,
    }
    expect(isAmount(props)).toBe(true)
  })
  it('should return false if the amount is not a number', () => {
    const props = {}
    expect(isAmount(props)).toBe(false)
  })
})
