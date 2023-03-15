import { shouldShowConfirmCancelTradeRequest } from '.'

describe('shouldShowConfirmCancelTradeRequest', () => {
  it('returns true if contract cancelation has been confirmed', () => {
    const contract: Partial<Contract> = {
      cancelationRequested: true,
      disputeActive: false,
      paymentConfirmed: null,
    }

    expect(shouldShowConfirmCancelTradeRequest(contract as Contract, 'buyer')).toBe(true)
  })

  it('returns false if view is not "buyer"', () => {
    const contract: Partial<Contract> = {
      cancelationRequested: true,
      disputeActive: false,
      paymentConfirmed: null,
    }

    expect(shouldShowConfirmCancelTradeRequest(contract as Contract, 'seller')).toBe(false)
  })

  it('returns false if dispute is active', () => {
    const contract: Partial<Contract> = {
      cancelationRequested: true,
      disputeActive: true,
      paymentConfirmed: null,
    }

    expect(shouldShowConfirmCancelTradeRequest(contract as Contract, 'buyer')).toBe(false)
  })

  it('returns false if payment is confirmed', () => {
    const contract: Partial<Contract> = {
      cancelationRequested: true,
      disputeActive: false,
      paymentConfirmed: new Date(),
    }

    expect(shouldShowConfirmCancelTradeRequest(contract as Contract, 'buyer')).toBe(false)
  })

  it('returns false if cancelationRequested is false', () => {
    const contract: Partial<Contract> = {
      cancelationRequested: false,
      disputeActive: false,
      paymentConfirmed: null,
    }

    expect(shouldShowConfirmCancelTradeRequest(contract as Contract, 'buyer')).toBe(false)
  })
})
