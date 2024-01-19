import { shouldGoToSearch } from './shouldGoToSearch'

describe('shouldGoToSearch', () => {
  it('should return true if messageType is offer.matchBuyer', () => {
    expect(shouldGoToSearch('offer.matchBuyer', false)).toBe(true)
  })

  it('should return true if messageType is offer.matchSeller', () => {
    expect(shouldGoToSearch('offer.matchSeller', false)).toBe(true)
  })

  it('should return true if messageType is offer.escrowFunded and hasMatches is true', () => {
    expect(shouldGoToSearch('offer.escrowFunded', true)).toBe(true)
  })

  it('should return false if messageType is offer.escrowFunded and hasMatches is false', () => {
    expect(shouldGoToSearch('offer.escrowFunded', false)).toBe(false)
  })

  it('should return false if messageType is not offer.matchBuyer or offer.matchSeller or offer.escrowFunded', () => {
    // @ts-expect-error testing invalid input
    expect(shouldGoToSearch('offer.notMatch', false)).toBe(false)
  })
})
