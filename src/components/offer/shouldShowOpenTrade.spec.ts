import { shouldShowOpenTrade } from './shouldShowOpenTrade'

describe('shouldShowOpenTrade', () => {
  it('should return true when trade is not complete and not canceled', () => {
    expect(shouldShowOpenTrade({ paymentConfirmed: null, canceled: false })).toEqual(true)
  })

  it('should return false when trade is complete', () => {
    expect(shouldShowOpenTrade({ paymentConfirmed: new Date(2021, 1, 1), canceled: false })).toEqual(false)
  })

  it('should return false when trade is canceled', () => {
    expect(shouldShowOpenTrade({ paymentConfirmed: null, canceled: true })).toEqual(false)
  })
})
