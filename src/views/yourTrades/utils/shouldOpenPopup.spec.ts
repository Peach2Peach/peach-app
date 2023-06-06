import { shouldOpenPopup } from './shouldOpenPopup'

describe('shouldOpenPopup', () => {
  it('should return true if popup should open', () => {
    expect(shouldOpenPopup('refundTxSignatureRequired')).toBe(true)
  })
  it('should return false for other statuses', () => {
    expect(shouldOpenPopup('dispute')).toBe(false)
    expect(shouldOpenPopup('offerCanceled')).toBe(false)
    expect(shouldOpenPopup('paymentRequired')).toBe(false)
    expect(shouldOpenPopup('confirmPaymentRequired')).toBe(false)
  })
})
