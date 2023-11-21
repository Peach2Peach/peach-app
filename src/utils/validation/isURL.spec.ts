import { isURL } from './isURL'

describe('isURL', () => {
  it('should return true for a valid URL', () => {
    expect(isURL('https://www.example.com')).toBe(true)
    expect(isURL('https://www.example.com:8333')).toBe(true)
    expect(isURL('https://www.example.com/?query=param')).toBe(true)
    expect(isURL('https://www.example.com/#anchor')).toBe(true)
    expect(isURL('http://example.com')).toBe(true)
    expect(isURL('ssl://example.com')).toBe(true)
    expect(isURL('ftp://example.com')).toBe(true)
    expect(isURL('example.com')).toBe(true)
  })
  it('should return true for a valid IP', () => {
    expect(isURL('192.168.1.21')).toBe(true)
    expect(isURL('192.168.1.21:8333')).toBe(true)
  })

  it('should return false for an invalid URL', () => {
    expect(isURL('https://')).toBe(false)
  })

  it('should return false for an empty string', () => {
    expect(isURL('')).toBe(false)
  })
})
