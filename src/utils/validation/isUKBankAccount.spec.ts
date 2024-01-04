import { isUKBankAccount } from './isUKBankAccount'

describe('isUKBankAccount', () => {
  it('should return true for a valid UK bank account number', () => {
    expect(isUKBankAccount('12345678')).toBe(true)
  })
  it('should return false for a number that is too short', () => {
    expect(isUKBankAccount('12345')).toBe(false)
  })
  it('should return false for a number that is too long', () => {
    expect(isUKBankAccount('123451234512345')).toBe(false)
  })

  it('should return false for an invalid UK bank account number', () => {
    expect(isUKBankAccount('abc12345')).toBe(false)
  })

  it('should return false for an empty string', () => {
    expect(isUKBankAccount('')).toBe(false)
  })
})
