import { getOfferPrice } from '../../../../src/utils/offer'

describe('getOfferPrice', () => {
  it('should return the correct offer price in the given currency', () => {
    const prices: Pricebook = {
      USD: 10000,
      EUR: 12000,
    }
    expect(getOfferPrice(1000000, 10, prices, 'USD')).toEqual(110)
    expect(getOfferPrice(1000000, 10, prices, 'EUR')).toEqual(132)
  })

  it('should return 0 if the currency is not available in the offer', () => {
    const prices: Pricebook = {
      USD: 10000,
    }
    expect(getOfferPrice(2000000, 10, prices, 'EUR')).toEqual(0)
  })
})
