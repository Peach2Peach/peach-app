import { isBancolombiaAccountNumber } from './isBancolombiaAccountNumber'

describe('isBancolombiaAccountNumber', () => {
  it('should return true a length of 11-14 digits', () => {
    expect(isBancolombiaAccountNumber('12345678901234')).toBe(true)
    expect(isBancolombiaAccountNumber('12345678901')).toBe(true)
  })

  it('should return false a non 11-14 digit number', () => {
    expect(isBancolombiaAccountNumber('1234567890')).toBe(false)
    expect(isBancolombiaAccountNumber('123456789012345')).toBe(false)
  })

  it('should return false non digit characters', () => {
    expect(isBancolombiaAccountNumber('1234567890123a')).toBe(false)
  })
})
