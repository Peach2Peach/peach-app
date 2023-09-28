import { addProtocol } from './addProtocol'

describe('addProtocol', () => {
  it('should add protocol to address', () => {
    expect(addProtocol('example.com', 'http')).toBe('http://example.com')
  })

  it('should change protocol of address if already existing', () => {
    expect(addProtocol('http://example.com', 'http')).toBe('http://example.com')
    expect(addProtocol('http://example.com', 'https')).toBe('https://example.com')
  })
})
