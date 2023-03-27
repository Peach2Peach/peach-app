import { shouldGoToOfferSummary } from './shouldGoToOfferSummary'

describe('shouldGoToOfferSummary', () => {
  it('should return true for offerCanceled', () => {
    expect(shouldGoToOfferSummary('offerCanceled')).toBe(true)
  })
  it('should return false for other statuses', () => {
    expect(shouldGoToOfferSummary('fundEscrow')).toBe(false)
    expect(shouldGoToOfferSummary('escrowWaitingForConfirmation')).toBe(false)
    expect(shouldGoToOfferSummary('searchingForPeer')).toBe(false)
    expect(shouldGoToOfferSummary('hasMatchesAvailable')).toBe(false)
  })
})
