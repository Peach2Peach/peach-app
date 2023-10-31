import { isOpenAction } from './isOpenAction'

describe('isOpenAction', () => {
  it('should return true for status that should show as waiting', () => {
    expect(isOpenAction('ask', 'fundEscrow')).toBe(true)
    expect(isOpenAction('ask', 'fundingAmountDifferent')).toBe(true)
    expect(isOpenAction('ask', 'hasMatchesAvailable')).toBe(true)
    expect(isOpenAction('ask', 'offerHiddenWithMatchesAvailable')).toBe(true)
    expect(isOpenAction('ask', 'rateUser')).toBe(true)

    expect(isOpenAction('bid', 'paymentRequired')).toBe(true)
    expect(isOpenAction('ask', 'confirmPaymentRequired')).toBe(true)
    expect(isOpenAction('ask', 'paymentTooLate')).toBe(true)
  })
  it('should return false for status that should not show as waiting', () => {
    expect(isOpenAction('ask', 'offerCanceled')).toBe(false)
    expect(isOpenAction('ask', 'confirmCancelation')).toBe(false)
    expect(isOpenAction('ask', 'dispute')).toBe(false)

    expect(isOpenAction('ask', 'paymentRequired')).toBe(false)
    expect(isOpenAction('bid', 'confirmPaymentRequired')).toBe(false)
    expect(isOpenAction('bid', 'paymentTooLate')).toBe(false)
  })
})
