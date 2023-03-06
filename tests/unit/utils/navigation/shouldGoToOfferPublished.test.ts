import { shouldGoToOfferPublished } from '../../../../src/utils/navigation/shouldGoToOfferPublished'

describe('shouldGoToOfferPublished', () => {
  it('should return true if messageType is offer.escrowFunded', () => {
    expect(shouldGoToOfferPublished('offer.escrowFunded')).toBe(true)
  })

  it('should return false if messageType is not offer.escrowFunded', () => {
    expect(shouldGoToOfferPublished('offer.notFunded')).toBe(false)
  })
})
