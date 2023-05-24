import { convertFiatToSats } from './convertFiatToSats'

describe('convertFiatToSats', () => {
  it('calculates price for given amount of sats', () => {
    expect(convertFiatToSats(10, 25000)).toEqual(40000)
    expect(convertFiatToSats(25000, 25000)).toEqual(100000000)
  })
})
