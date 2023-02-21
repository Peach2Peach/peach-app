import { getMatchCurrency } from '../../../../src/utils/match'

describe('getMatchCurrency', () => {
  test('should return the first currency of the common means of payment if there are common values', () => {
    const offerMeansOfPayment = {
      EUR: ['sepa', 'paypal'],
      CHF: ['twint'],
    }
    const matchMeansOfPayment = {
      EUR: ['sepa', 'paypal'],
      CHF: ['twint'],
    }

    expect(getMatchCurrency(offerMeansOfPayment, matchMeansOfPayment)).toBe('EUR')
  })

  test('should return the first currency of match means of payment if there are no common values', () => {
    const offerMeansOfPayment = {
      EUR: ['sepa', 'paypal'],
      CHF: ['twint'],
    }
    const matchMeansOfPayment = {
      EUR: ['wise'],
      GBP: ['fasterPayments'],
    }

    expect(getMatchCurrency(offerMeansOfPayment, matchMeansOfPayment)).toBe('EUR')
  })
})
