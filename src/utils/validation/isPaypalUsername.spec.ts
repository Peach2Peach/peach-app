import { isPaypalUsername } from './isPaypalUsername'

describe('isPaypalUsername', () => {
  it('should return true for a valid paypal username', () => {
    const validUsernames = ['@alphanumeric1', '@alphanumeric', '@a']

    validUsernames.forEach((username) => {
      expect(isPaypalUsername(username)).toBe(true)
    })
  })

  it('should return false for an invalid paypal username', () => {
    const invalidUsernames = ['@double@double', '@Alphanumeric1', '@', 'alphanumeric1', '@A1', '']

    invalidUsernames.forEach((username) => {
      expect(isPaypalUsername(username)).toBe(false)
    })
  })

  it('returns false for usernames with more than 20 characters', () => {
    expect(isPaypalUsername('@abcdefghijklmnopqrstuv')).toBe(false)
  })

  it('returns false for usernames with no letters', () => {
    expect(isPaypalUsername('@1234567890')).toBe(false)
  })
})
