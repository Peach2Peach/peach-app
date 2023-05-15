import { getPrice } from './getPrice'

describe('getPrice', () => {
  it('calculates price for given amount of sats', () => {
    expect(getPrice(40000, 25000)).toEqual(10)
    expect(getPrice(100000000, 25000)).toEqual(25000)
  })
})
