import { getOfferPrice } from './getOfferPrice'

describe('getOfferPrice', () => {
  it('should return the correct offer price in the given currency', () => {
    const prices: Pricebook = {
      USD: 10000,
      EUR: 12000,
    }
    const expectedUSDPrice = 110
    const expectedEURPrice = 132
    expect(getOfferPrice({ amount: 1000000, premium: 10, prices, currency: 'USD' })).toEqual(expectedUSDPrice)
    expect(getOfferPrice({ amount: 1000000, premium: 10, prices, currency: 'EUR' })).toEqual(expectedEURPrice)
  })

  it('should return 0 if the currency is not available in the offer', () => {
    const prices: Pricebook = {
      USD: 10000,
    }
    expect(getOfferPrice({ amount: 2000000, premium: 10, prices, currency: 'EUR' })).toEqual(0)
  })
})
