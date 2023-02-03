import { shouldShowTradeCanceled } from '../../../../src/utils/overlay'

describe('shouldShowTradeCanceled', () => {
  it('returns true if buyer canceled trade', () => {
    const contract: Partial<Contract> = {
      canceled: true,
      cancelConfirmationDismissed: false,
      paymentConfirmed: null,
    }
    const view = 'seller'
    expect(shouldShowTradeCanceled(contract as Contract, view)).toBe(true)
  })

  it('returns false if contract is not canceled', () => {
    const contract: Partial<Contract> = {
      canceled: false,
      cancelConfirmationDismissed: false,
      paymentConfirmed: null,
    }
    const view = 'seller'
    expect(shouldShowTradeCanceled(contract as Contract, view)).toBe(false)
  })

  it('returns false if view is not "seller"', () => {
    const contract: Partial<Contract> = {
      canceled: true,
      cancelConfirmationDismissed: false,
      paymentConfirmed: null,
    }
    const view = 'buyer'
    expect(shouldShowTradeCanceled(contract as Contract, view)).toBe(false)
  })

  it('returns false if cancel confirmation is dismissed', () => {
    const contract: Partial<Contract> = {
      canceled: true,
      cancelConfirmationDismissed: true,
      paymentConfirmed: null,
    }
    const view = 'seller'
    expect(shouldShowTradeCanceled(contract as Contract, view)).toBe(false)
  })

  it('returns false if payment is confirmed', () => {
    const contract: Partial<Contract> = {
      canceled: true,
      cancelConfirmationDismissed: false,
      paymentConfirmed: new Date(),
    }
    const view = 'seller'
    expect(shouldShowTradeCanceled(contract as Contract, view)).toBe(false)
  })
})
