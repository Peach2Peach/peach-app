import { setPaymentMethods } from '../../../paymentMethods'
import { isForbiddenPaymentMethodError } from './isForbiddenPaymentMethodError'

describe('isForbiddenPaymentMethodError', () => {
  beforeAll(() => {
    setPaymentMethods([{ id: 'paypal', currencies: ['EUR'], anonymous: false }])
  })
  it('should return true if error is in relation to a forbidden payment method', () => {
    expect(isForbiddenPaymentMethodError('FORBIDDEN', ['paypal'])).toBeTruthy()
  })
  it('should return true if error is not in relation to a forbidden payment method', () => {
    expect(isForbiddenPaymentMethodError('FORBIDDEN', ['other'])).toBeFalsy()
    expect(isForbiddenPaymentMethodError('UNAUTHORIZED', undefined)).toBeFalsy()
  })
})
