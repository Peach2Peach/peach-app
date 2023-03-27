import { canCancelContract } from '.'

describe('canCancelContract', () => {
  it('returns false if contract is in dispute', () => {
    const contract: Partial<Contract> = {
      disputeActive: true,
      paymentMade: null,
      canceled: false,
      cancelationRequested: false,
    }
    expect(canCancelContract(contract as Contract)).toBe(false)
  })

  it('returns false if payment has been made', () => {
    const contract: Partial<Contract> = {
      disputeActive: false,
      paymentMade: new Date(),
      canceled: false,
      cancelationRequested: false,
    }
    expect(canCancelContract(contract as Contract)).toBe(false)
  })

  it('returns false if cancelation has been requested', () => {
    const contract: Partial<Contract> = {
      disputeActive: false,
      paymentMade: null,
      canceled: false,
      cancelationRequested: true,
    }
    expect(canCancelContract(contract as Contract)).toBe(false)
  })

  it('returns false if contract has been canceled', () => {
    const contract: Partial<Contract> = {
      disputeActive: false,
      paymentMade: null,
      canceled: true,
      cancelationRequested: false,
    }
    expect(canCancelContract(contract as Contract)).toBe(false)
  })

  it('returns true in all other cases', () => {
    const contract: Partial<Contract> = {
      disputeActive: false,
      paymentMade: null,
      canceled: false,
      cancelationRequested: false,
    }
    expect(canCancelContract(contract as Contract)).toBe(true)
  })
})
