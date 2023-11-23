import { ANONYMOUS_PAYMENTCATEGORIES } from '../../paymentMethods'
import { isLimitReached } from './isLimitReached'

describe('isLimitReached', () => {
  it('should return true if all limits are exceeded', () => {
    const exceedsLimit = ['daily', 'monthlyAnonymous', 'yearly'] satisfies Partial<keyof TradingLimit>[]
    const result = isLimitReached(exceedsLimit)
    expect(result).toBe(true)
  })
  it('should return true if monthlyAnonymous limit is exceeded and selectedPaymentMethod is anonymous', () => {
    const exceedsLimit = ['monthlyAnonymous'] satisfies Partial<keyof TradingLimit>[]
    const result = isLimitReached(exceedsLimit, ANONYMOUS_PAYMENTCATEGORIES[0])
    expect(result).toBe(true)
  })
  it('should return false if monthlyAnonymous limit is exceeded but selectedPaymentMethod is not anonymous', () => {
    const exceedsLimit = ['monthlyAnonymous'] satisfies Partial<keyof TradingLimit>[]
    const result = isLimitReached(exceedsLimit, 'sepa')
    expect(result).toBe(false)
  })
  it('should return true if daily limit is exceeded', () => {
    const exceedsLimit = ['daily'] satisfies Partial<keyof TradingLimit>[]
    const result = isLimitReached(exceedsLimit)
    expect(result).toBe(true)
  })
  it('should return true if yearly limit is exceeded', () => {
    const exceedsLimit = ['yearly'] satisfies Partial<keyof TradingLimit>[]
    const result = isLimitReached(exceedsLimit)
    expect(result).toBe(true)
  })
  it('should return false if no limits are exceeded', () => {
    const exceedsLimit = [] satisfies Partial<keyof TradingLimit>[]
    const result = isLimitReached(exceedsLimit)
    expect(result).toBe(false)
  })
})
