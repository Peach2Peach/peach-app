import { shouldShowTradeCanceled } from '.'

describe('shouldShowTradeCanceled', () => {
  it('returns true if buyer canceled trade', () => {
    const contract = {
      canceled: true,
      cancelConfirmationDismissed: false,
      paymentConfirmed: null,
    }
    const view = 'seller'
    expect(shouldShowTradeCanceled(contract, view)).toBe(true)
  })

  it('returns false if contract is not canceled', () => {
    const contract = {
      canceled: false,
      cancelConfirmationDismissed: false,
      paymentConfirmed: null,
    }
    const view = 'seller'
    expect(shouldShowTradeCanceled(contract, view)).toBe(false)
  })

  it('returns false if view is not "seller"', () => {
    const contract = {
      canceled: true,
      cancelConfirmationDismissed: false,
      paymentConfirmed: null,
    }
    const view = 'buyer'
    expect(shouldShowTradeCanceled(contract, view)).toBe(false)
  })

  it('returns false if cancel confirmation is dismissed', () => {
    const contract = {
      canceled: true,
      cancelConfirmationDismissed: true,
      paymentConfirmed: null,
    }
    const view = 'seller'
    expect(shouldShowTradeCanceled(contract, view)).toBe(false)
  })

  it('returns false if payment is confirmed', () => {
    const contract = {
      canceled: true,
      cancelConfirmationDismissed: false,
      paymentConfirmed: new Date(),
    }
    const view = 'seller'
    expect(shouldShowTradeCanceled(contract, view)).toBe(false)
  })

  it('returns false if the seller won the dispute', () => {
    const contract = {
      canceled: true,
      cancelConfirmationDismissed: false,
      paymentConfirmed: null,
      disputeWinner: 'seller',
    } as const
    const view = 'seller'
    expect(shouldShowTradeCanceled(contract, view)).toBe(false)
  })
})
