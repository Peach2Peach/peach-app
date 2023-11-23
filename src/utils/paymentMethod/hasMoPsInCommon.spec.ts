import { hasMoPsInCommon } from './hasMoPsInCommon'

describe('hasMoPsInCommon', () => {
  test('should return true if both means of payment have common values', () => {
    const mopsA: MeansOfPayment = {
      CHF: ['twint'],
      EUR: ['sepa', 'paypal'],
    }
    const mopsB: MeansOfPayment = {
      CHF: ['twint'],
      EUR: ['sepa', 'paypal'],
    }

    expect(hasMoPsInCommon(mopsA, mopsB)).toBe(true)
  })

  test('should return false if both means of payment have no common values', () => {
    const mopsA: MeansOfPayment = {
      CHF: ['twint'],
      EUR: ['sepa', 'paypal'],
    }
    const mopsB: MeansOfPayment = {
      CHF: ['wise'],
      EUR: ['revolut'],
    }

    expect(hasMoPsInCommon(mopsA, mopsB)).toBe(false)
  })
})
