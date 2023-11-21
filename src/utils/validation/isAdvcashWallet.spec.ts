import { isAdvcashWallet } from './isAdvcashWallet'

describe('isAdvcashWallet', () => {
  it('should return true for a valid AdvCash wallet address', () => {
    expect(isAdvcashWallet('u123456789012')).toBe(true)
    expect(isAdvcashWallet('e123456789012')).toBe(true)
    expect(isAdvcashWallet('g123456789012')).toBe(true)
  })

  it('should return false for a wallet address that does not start with u/e/g', () => {
    expect(isAdvcashWallet('a123456789012')).toBe(false)
  })

  it('should return false for a wallet address that contains non-alphanumeric characters', () => {
    expect(isAdvcashWallet('u1234$6789012')).toBe(false)
  })

  it('should return false for a wallet address that is too long', () => {
    expect(isAdvcashWallet('u1234567890123')).toBe(false)
  })

  it('should return false for a wallet address that is too short', () => {
    expect(isAdvcashWallet('u12345678901')).toBe(false)
  })

  it('should return true for a valid AdvCash wallet address with spaces', () => {
    expect(isAdvcashWallet('u1234 5678 9012')).toBe(true)
  })

  it('should return false for a wallet address with spaces and invalid characters', () => {
    expect(isAdvcashWallet('u1234 5$78 9012')).toBe(false)
  })
})
