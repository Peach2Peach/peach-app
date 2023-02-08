import { shouldGoToSell } from '../../../../src/utils/navigation/shouldGoToSell'

describe('shouldGoToSell', () => {
  it('should return true if messageType is offer.notFunded and offerId is defined', () => {
    expect(shouldGoToSell({ messageType: 'offer.notFunded', data: { offerId: 'test' } })).toBe(true)
  })

  it('should return false if messageType is not offer.notFunded', () => {
    expect(shouldGoToSell({ messageType: 'offer.notMatch', data: { offerId: 'test' } })).toBe(false)
  })

  it('should return false if offerId is not defined', () => {
    expect(shouldGoToSell({ messageType: 'offer.notFunded', data: { offerId: '' } })).toBe(false)
  })
})
