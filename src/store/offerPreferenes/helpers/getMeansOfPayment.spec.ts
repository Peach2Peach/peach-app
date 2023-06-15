import { paymentData } from '../../../../tests/unit/data/accountData'
import { getMeansOfPayment } from './getMeansOfPayment'

describe('getMeansOfPayment', () => {
  it('should return the expected object', () => {
    const mockData = paymentData
    const expected = {
      EUR: ['sepa'],
    }
    expect(getMeansOfPayment(mockData)).toEqual(expected)
  })
})
