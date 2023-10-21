import { isWaiting } from './isWaiting'

describe('isWaiting', () => {
  it('should return true for status that should show as waiting', () => {
    expect(isWaiting('ask', 'escrowWaitingForConfirmation')).toBe(true)
    expect(isWaiting('ask', 'searchingForPeer')).toBe(true)
    expect(isWaiting('ask', 'offerHidden')).toBe(true)

    expect(isWaiting('ask', 'paymentRequired')).toBe(true)
    expect(isWaiting('bid', 'confirmPaymentRequired')).toBe(true)
    expect(isWaiting('bid', 'payoutPending')).toBe(true)
    expect(isWaiting('bid', 'paymentTooLate')).toBe(true)
  })
  it('should return false for status that should not show as waiting', () => {
    expect(isWaiting('ask', 'offerCanceled')).toBe(false)
    expect(isWaiting('ask', 'confirmCancelation')).toBe(false)
    expect(isWaiting('ask', 'dispute')).toBe(false)

    expect(isWaiting('bid', 'paymentRequired')).toBe(false)
    expect(isWaiting('ask', 'confirmPaymentRequired')).toBe(false)
    expect(isWaiting('ask', 'paymentTooLate')).toBe(false)
  })
})
