import { shouldGoToYourTradesSell } from '../../../../src/utils/navigation/shouldGoToYourTradesSell'

describe('shouldGoToYourTradesSell', () => {
  it('should return false if offerId is not defined', () => {
    expect(shouldGoToYourTradesSell({ messageType: 'offer.notFunded', data: { offerId: '' } })).toBe(false)
  })

  it('should return true if messageType is offer.sellOfferExpired and offerId is defined', () => {
    expect(shouldGoToYourTradesSell({ messageType: 'offer.sellOfferExpired', data: { offerId: 'test' } })).toBe(true)
  })

  it('should return true if messageType is offer.fundingAmountDifferent and offerId is defined', () => {
    expect(shouldGoToYourTradesSell({ messageType: 'offer.fundingAmountDifferent', data: { offerId: 'test' } })).toBe(
      true,
    )
  })

  it('should return true if messageType is offer.wrongFundingAmount and offerId is defined', () => {
    expect(shouldGoToYourTradesSell({ messageType: 'offer.wrongFundingAmount', data: { offerId: 'test' } })).toBe(true)
  })

  it('should return false if messageType is something else', () => {
    expect(shouldGoToYourTradesSell({ messageType: 'offer.somethingElse', data: { offerId: 'test' } })).toBe(false)
  })
})
