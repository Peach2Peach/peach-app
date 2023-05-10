import { getOffset } from './getOffset'

describe('getOffset', () => {
  it('calculates the offset', () => {
    expect(getOffset({ amount: 3000, min: 300, max: 5000, trackHeight: 350 })).toBe(149)
  })
})
