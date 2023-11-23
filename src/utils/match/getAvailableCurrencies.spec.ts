import { getAvailableCurrencies } from './getAvailableCurrencies'

describe('getAvailableCurrencies', () => {
  it('should return only shared currencies if they exist', () => {
    const mopsIncCommon: MeansOfPayment = {
      EUR: ['cash.someMeetup'],
      USD: ['cash.someMeetup'],
    }
    const matchMeansOfPayment: MeansOfPayment = {
      EUR: ['cash.someMeetup'],
      USD: ['cash.someMeetup'],
      GBP: ['cash.someMeetup'],
    }

    const result = getAvailableCurrencies(mopsIncCommon, matchMeansOfPayment)

    expect(result).toEqual(['EUR', 'USD'])
  })
  it('should return match currencies if shared currencies do not exist', () => {
    const mopsIncCommon: MeansOfPayment = {}
    const matchMeansOfPayment: MeansOfPayment = {
      EUR: ['cash.someMeetup'],
      USD: ['cash.someMeetup'],
    }

    const result = getAvailableCurrencies(mopsIncCommon, matchMeansOfPayment)

    expect(result).toEqual(['EUR', 'USD'])
  })
})
