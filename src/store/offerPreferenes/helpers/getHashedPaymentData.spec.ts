import { paymentData } from '../../../../tests/unit/data/accountData'
import { getHashedPaymentData } from './getHashedPaymentData'

describe('getHashedPaymentData', () => {
  it('should return the expected object', () => {
    const mockData: PaymentData[] = paymentData
    const expected = {
      sepa: {
        hash: '4af00de25f28a776eb88dcf6161f5b43f7ca5be9656cf49fd6ce78ef879ff1a2',
        country: undefined,
      },
    }
    expect(getHashedPaymentData(mockData)).toEqual(expected)
  })
})
