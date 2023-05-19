import { shouldOpenOverlay } from './shouldOpenOverlay'

describe('shouldOpenOverlay', () => {
  it('should return true if overlay should open', () => {
    expect(shouldOpenOverlay('refundTxSignatureRequired')).toBe(true)
  })
  it('should return false for other statuses', () => {
    expect(shouldOpenOverlay('dispute')).toBe(false)
    expect(shouldOpenOverlay('offerCanceled')).toBe(false)
    expect(shouldOpenOverlay('paymentRequired')).toBe(false)
    expect(shouldOpenOverlay('confirmPaymentRequired')).toBe(false)
  })
})
