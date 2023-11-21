/* eslint-disable no-magic-numbers */
import { getNormalized } from './getNormalized'

describe('getNormalized', () => {
  it('should return 0 if val is negative', () => {
    expect(getNormalized(-1, 10)).toEqual(0)
    expect(getNormalized(-10, 100)).toEqual(0)
  })

  it('should return val / max if val is between 0 and max', () => {
    expect(getNormalized(5, 10)).toEqual(0.5)
    expect(getNormalized(50, 100)).toEqual(0.5)
  })

  it('should return 1 if val is greater than or equal to max', () => {
    expect(getNormalized(10, 10)).toEqual(1)
    expect(getNormalized(100, 50)).toEqual(1)
  })

  it('should handle values close to the boundaries', () => {
    expect(getNormalized(-0.00001, 10)).toEqual(0)
    expect(getNormalized(0.99999, 10)).toEqual(0.99999 / 10)
  })

  it('should handle values of max close to the limits of the number type', () => {
    expect(getNormalized(5, Number.MAX_SAFE_INTEGER)).toEqual(5 / Number.MAX_SAFE_INTEGER)
    expect(getNormalized(5, Number.MAX_VALUE)).toEqual(5 / Number.MAX_VALUE)
  })
})
