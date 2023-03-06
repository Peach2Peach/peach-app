import { shouldShowCancelTradeRequestRejected } from '../../../../src/utils/overlay'

// eslint-disable-next-line max-lines-per-function
describe('shouldShowCancelTradeRequestRejected', () => {
  it('returns true if contract cancel request has been rejected', () => {
    const contract: Partial<Contract> = {
      canceled: false,
      paymentConfirmed: null,
      cancelationRequested: false,
      cancelConfirmationPending: true,
      cancelConfirmationDismissed: false,
    }

    expect(shouldShowCancelTradeRequestRejected(contract as Contract, 'seller')).toBe(true)
  })

  it('returns false if contract is canceled', () => {
    const contract: Partial<Contract> = {
      canceled: true,
      paymentConfirmed: null,
      cancelationRequested: false,
      cancelConfirmationPending: true,
      cancelConfirmationDismissed: false,
    }

    expect(shouldShowCancelTradeRequestRejected(contract as Contract, 'seller')).toBe(false)
  })

  it('returns false if view is not "seller"', () => {
    const contract: Partial<Contract> = {
      canceled: false,
      paymentConfirmed: null,
      cancelationRequested: false,
      cancelConfirmationPending: true,
      cancelConfirmationDismissed: false,
    }

    expect(shouldShowCancelTradeRequestRejected(contract as Contract, 'buyer')).toBe(false)
  })

  it('returns false if payment is confirmed', () => {
    const contract: Partial<Contract> = {
      canceled: false,
      paymentConfirmed: new Date(),
      cancelationRequested: false,
      cancelConfirmationPending: true,
      cancelConfirmationDismissed: false,
    }

    expect(shouldShowCancelTradeRequestRejected(contract as Contract, 'seller')).toBe(false)
  })

  it('returns false if cancelation is requested', () => {
    const contract: Partial<Contract> = {
      canceled: false,
      paymentConfirmed: null,
      cancelationRequested: true,
      cancelConfirmationPending: true,
      cancelConfirmationDismissed: false,
    }

    expect(shouldShowCancelTradeRequestRejected(contract as Contract, 'seller')).toBe(false)
  })

  it('returns false if cancel confirmation is not pending', () => {
    const contract: Partial<Contract> = {
      canceled: false,
      paymentConfirmed: null,
      cancelationRequested: false,
      cancelConfirmationPending: false,
      cancelConfirmationDismissed: false,
    }

    expect(shouldShowCancelTradeRequestRejected(contract as Contract, 'seller')).toBe(false)
  })
})
