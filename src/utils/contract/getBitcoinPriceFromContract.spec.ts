import { getBitcoinPriceFromContract } from '.'

describe('getBitcoinPriceFromContract', () => {
  it('returns the correct price', () => {
    const expectedBitcoinPrice = 1000000
    const price = 21
    const amount = 1000
    const premium = 110
    const bitcoinPrice = getBitcoinPriceFromContract({ price, premium, amount })
    expect(bitcoinPrice).toEqual(expectedBitcoinPrice)
  })
})
