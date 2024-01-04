import { getBitcoinPriceFromContract } from './getBitcoinPriceFromContract'

describe('getBitcoinPriceFromContract', () => {
  it('returns the correct price', () => {
    expect(getBitcoinPriceFromContract({ price: 43600, amount: 40000 })).toEqual(109000000)
  })
})
