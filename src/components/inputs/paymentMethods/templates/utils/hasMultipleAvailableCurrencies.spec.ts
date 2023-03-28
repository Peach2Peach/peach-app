import { hasMultipleAvailableCurrencies } from './hasMultipleAvailableCurrencies'

describe('hasMultipleAvailableCurrencies', () => {
  it('should return true for skrill', () => {
    expect(hasMultipleAvailableCurrencies('skrill')).toBe(true)
  })

  it('should return true for neteller', () => {
    expect(hasMultipleAvailableCurrencies('neteller')).toBe(true)
  })

  it('should return false for other payment methods', () => {
    expect(hasMultipleAvailableCurrencies('sepa')).toBe(false)
  })
})
