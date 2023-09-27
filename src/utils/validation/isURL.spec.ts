import { isURL } from '.'

describe('isURL', () => {
  it('should return true for a valid URL', () => {
    expect(isURL('https://www.example.com')).toBe(true)
    expect(isURL('https://www.example.com/?query=param')).toBe(true)
    expect(isURL('https://www.example.com/#anchor')).toBe(true)
    expect(isURL('http://example.com')).toBe(true)
    expect(isURL('example.com')).toBe(true)
  })
  it('should return true for a valid IP', () => {
    expect(isURL('192.168.1.21')).toBe(true)
    expect(isURL('2345:0425:2CA1:0000:0000:0567:5673:23b5')).toBe(true)
    expect(isURL('2345:425:2CA1:0:0:567:5673:23b5')).toBe(true)
    expect(isURL('2345:425:2CA1:::567:5673:23b5')).toBe(true)
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
