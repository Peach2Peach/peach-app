import { getBitcoinPriceFromContract } from '../../../../src/utils/contract'

describe('getBitcoinPriceFromContract', () => {
  it('returns the correct price', () => {
    const price = 100
    const premium = 10
    const amount = 100000
    const bitcoinPrice = getBitcoinPriceFromContract({ price, premium, amount })
    expect(bitcoinPrice).toEqual(90000)
  })
})
