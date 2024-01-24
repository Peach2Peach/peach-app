import { getBitcoinPriceFromContract } from './getBitcoinPriceFromContract'

describe('getBitcoinPriceFromContract', () => {
  it('returns the correct price', () => {
    const expectedBitcoinPrice = 109000000
    expect(getBitcoinPriceFromContract({ price: 43600, amount: 40000 })).toEqual(expectedBitcoinPrice)
  })
})
