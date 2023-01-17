import { getOfferPrice } from '../../../../src/utils/offer'

describe('getOfferPrice', () => {
  it('should return the correct offer price in the given currency', () => {
    const offer: Partial<SellOffer> = {
      prices: {
        USD: 10000,
        EUR: 12000,
      },
      amount: 1000000,
      premium: 10,
    }
    expect(getOfferPrice(offer as SellOffer, 'USD')).toEqual(110)
    expect(getOfferPrice(offer as SellOffer, 'EUR')).toEqual(132)
  })

  it('should return 0 if the offer has no prices', () => {
    const offer: Partial<SellOffer> = {
      amount: 200000,
      premium: 10,
    }
    expect(getOfferPrice(offer as SellOffer, 'USD')).toEqual(0)
  })

  it('should return 0 if the currency is not available in the offer', () => {
    const offer: Partial<SellOffer> = {
      prices: {
        USD: 10000,
      },
      amount: 2000000,
      premium: 10,
    }
    expect(getOfferPrice(offer as SellOffer, 'EUR')).toEqual(0)
  })
})
