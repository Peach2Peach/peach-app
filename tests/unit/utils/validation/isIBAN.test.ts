import { isIBAN } from '../../../../src/utils/validation'
import paymentData from '../../data/paymentData.json'

describe('isIBAN', () => {
  it('should return true for valid IBANs', () => {
    for (const iban of paymentData.iban.valid) {
      expect(isIBAN(iban)).toBe(true)
    }
  })
  it('should return false for invalid IBANs', () => {
    for (const iban of paymentData.iban.invalid) {
      expect(!isIBAN(iban)).toBe(true)
    }
  })
})
