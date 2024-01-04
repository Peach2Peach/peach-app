import paymentData from '../../../tests/unit/data/paymentData.json'
import { isIBAN } from './isIBAN'

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
