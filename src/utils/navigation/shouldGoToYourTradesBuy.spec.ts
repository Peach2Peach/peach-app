import { shouldGoToYourTradesBuy } from './shouldGoToYourTradesBuy'

describe('shouldGoToYourTradesBuy', () => {
  it('should return true if PN should lead to your trades buy tab', () => {
    expect(shouldGoToYourTradesBuy({ offerId: 'test', type: 'offer.buyOfferExpired' })).toBeTruthy()
  })

  it('should return false if offerId is not defined', () => {
    expect(shouldGoToYourTradesBuy({ offerId: '', type: 'offer.buyOfferExpired' })).toBe(false)
  })
})
