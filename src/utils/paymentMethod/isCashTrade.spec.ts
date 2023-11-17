import { isCashTrade } from './isCashTrade'

describe('isCashTrade', () => {
  it('returns true if a payment method is a cash trade', () => {
    expect(isCashTrade('cash.de.berlin-meetup')).toBeTruthy()
    expect(isCashTrade('cash.')).toBeTruthy()
  })
  it('returns false if a payment method is not a cash trade', () => {
    expect(isCashTrade('sepa')).toBeFalsy()
    expect(isCashTrade('paypal')).toBeFalsy()
    expect(isCashTrade('revolut')).toBeFalsy()
  })
})
