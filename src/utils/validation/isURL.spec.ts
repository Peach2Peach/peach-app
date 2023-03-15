import { isURL } from '.'

describe('isURL', () => {
  it('should return true for a valid URL', () => {
    expect(isURL('https://www.example.com')).toBe(true)
    expect(isURL('http://example.com')).toBe(true)
  })

  it('should return false for an invalid URL', () => {
    expect(isURL('https://')).toBe(false)
    expect(isURL('ps://www.example.com')).toBe(false)
    expect(isURL('invalidurl')).toBe(false)
  })

  it('should return false for an empty string', () => {
    expect(isURL('')).toBe(false)
  })
})
