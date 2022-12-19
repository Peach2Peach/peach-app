import { newCutOffAddress } from '../../../../src/utils/string/cutOffAddress'

describe('newCutOffAddress', () => {
  it('should return the same address if it is shorter than 15 characters', () => {
    expect(newCutOffAddress('1234567890')).toBe('1234567890')
  })

  it('should return the address cut in the middle and replaced with ...', () => {
    expect(newCutOffAddress('12345678901234567890')).toBe('12345678 ... 567890')
  })

  it('should handle empty string', () => {
    expect(newCutOffAddress('')).toBe('')
  })
})
