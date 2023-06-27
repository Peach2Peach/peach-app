import { hasFontSize } from './hasFontSize'

describe('hasFontSize', () => {
  it('returns true if fontSize is defined', () => {
    expect(hasFontSize({ fontSize: 1 })).toBe(true)
  })
  it('returns false if fontSize is undefined', () => {
    expect(hasFontSize({})).toBe(false)
  })
  it('returns false if fontSize is false', () => {
    expect(hasFontSize(false)).toBe(false)
  })
})
