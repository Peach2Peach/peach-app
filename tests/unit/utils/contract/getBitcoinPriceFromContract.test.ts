import { getBitcoinPriceFromContract } from '../../../../src/utils/contract'

describe('getBitcoinPriceFromContract', () => {
  it('returns the correct price', () => {
    const expectedBitconPrice = 1000000
    const price = 21
    const amount = 1000
    const premium = 110
    const bitcoinPrice = getBitcoinPriceFromContract({ price, premium, amount })
    expect(bitcoinPrice).toEqual(expectedBitconPrice)
  })
})
