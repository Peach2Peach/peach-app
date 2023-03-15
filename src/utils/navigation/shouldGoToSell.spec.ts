import { shouldGoToSell } from './shouldGoToSell'

describe('shouldGoToSell', () => {
  it('should return true if messageType is offer.notFunded and offerId is defined', () => {
    expect(shouldGoToSell({ data: { offerId: 'test', type: 'offer.notFunded' } })).toBe(true)
  })

  it('should return false if messageType is not offer.notFunded', () => {
    expect(shouldGoToSell({ data: { offerId: 'test', type: 'offer.wrongFundingAmount' } })).toBe(false)
  })

  it('should return false if offerId is not defined', () => {
    expect(shouldGoToSell({ data: { offerId: '', type: 'offer.notFunded' } })).toBe(false)
  })
})
