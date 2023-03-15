import { getAvailableCurrencies } from '.'

// eslint-disable-next-line max-lines-per-function
describe('getAvailableCurrencies', () => {
  it('should return only shared currencies if they exist', () => {
    const mopsIncCommon: MeansOfPayment = {
      EUR: ['cash'],
      USD: ['cash'],
    }
    const matchMeansOfPayment: MeansOfPayment = {
      EUR: ['cash'],
      USD: ['cash'],
      GBP: ['cash'],
    }

    const result = getAvailableCurrencies(mopsIncCommon, matchMeansOfPayment)

    expect(result).toEqual(['EUR', 'USD'])
  })
  it('should return match currencies if shared currencies do not exist', () => {
    const mopsIncCommon: MeansOfPayment = {}
    const matchMeansOfPayment: MeansOfPayment = {
      EUR: ['cash'],
      USD: ['cash'],
    }

    const result = getAvailableCurrencies(mopsIncCommon, matchMeansOfPayment)

    expect(result).toEqual(['EUR', 'USD'])
  })
})
