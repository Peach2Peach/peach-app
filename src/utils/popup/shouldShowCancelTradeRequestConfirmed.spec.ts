import { shouldShowCancelTradeRequestConfirmed } from '.'

// eslint-disable-next-line max-lines-per-function
describe('shouldShowCancelTradeRequestConfirmed', () => {
  it('returns true if the cancel request has been confirmed', () => {
    const contract: Partial<Contract> = {
      canceled: true,
      paymentConfirmed: null,
      cancelationRequested: false,
      cancelConfirmationPending: true,
      cancelConfirmationDismissed: false,
    }
    expect(shouldShowCancelTradeRequestConfirmed(contract as Contract, 'seller')).toBe(true)
  })

  it('returns false if contract is not canceled', () => {
    const contract: Partial<Contract> = {
      canceled: false,
      paymentConfirmed: null,
      cancelationRequested: false,
      cancelConfirmationPending: true,
      cancelConfirmationDismissed: false,
    }
    expect(shouldShowCancelTradeRequestConfirmed(contract as Contract, 'seller')).toBe(false)
  })

  it('returns false if view is not "seller"', () => {
    const contract: Partial<Contract> = {
      canceled: true,
      paymentConfirmed: null,
      cancelationRequested: false,
      cancelConfirmationPending: true,
      cancelConfirmationDismissed: false,
    }
    expect(shouldShowCancelTradeRequestConfirmed(contract as Contract, 'buyer')).toBe(false)
  })

  it('returns false if payment is confirmed', () => {
    const contract: Partial<Contract> = {
      canceled: true,
      paymentConfirmed: new Date(),
      cancelationRequested: false,
      cancelConfirmationPending: true,
      cancelConfirmationDismissed: false,
    }
    expect(shouldShowCancelTradeRequestConfirmed(contract as Contract, 'seller')).toBe(false)
  })

  it('returns false if cancelation is requested', () => {
    const contract: Partial<Contract> = {
      canceled: true,
      paymentConfirmed: null,
      cancelationRequested: true,
      cancelConfirmationPending: true,
      cancelConfirmationDismissed: false,
    }
    expect(shouldShowCancelTradeRequestConfirmed(contract as Contract, 'seller')).toBe(false)
  })

  it('returns false if cancel confirmation is not pending', () => {
    const contract: Partial<Contract> = {
      canceled: true,
      paymentConfirmed: null,
      cancelationRequested: false,
      cancelConfirmationPending: false,
      cancelConfirmationDismissed: false,
    }
    expect(shouldShowCancelTradeRequestConfirmed(contract as Contract, 'seller')).toBe(false)
  })

  it('returns false if cancel confirmation is dismissed', () => {
    const contract: Partial<Contract> = {
      canceled: true,
      paymentConfirmed: null,
      cancelationRequested: false,
      cancelConfirmationPending: false,
      cancelConfirmationDismissed: true,
    }
    expect(shouldShowCancelTradeRequestConfirmed(contract as Contract, 'seller')).toBe(false)
  })
})
