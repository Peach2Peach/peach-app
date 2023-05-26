import { canOpenDispute } from '.'

describe('canOpenDispute', () => {
  it('returns false if contract has no symmetric key', () => {
    const contract: Partial<Contract> = {
      symmetricKey: undefined,
      disputeActive: false,
      paymentMethod: 'paypal',
    }

    expect(canOpenDispute(contract as Contract)).toBe(false)
  })

  it('returns false if dispute is already active', () => {
    const contract: Partial<Contract> = {
      symmetricKey: 'symmetricKey',
      disputeActive: true,
      paymentMethod: 'paypal',
    }

    expect(canOpenDispute(contract as Contract)).toBe(false)
  })

  it('returns false if payment method is cash', () => {
    const contract: Partial<Contract> = {
      symmetricKey: 'symmetricKey',
      disputeActive: false,
      paymentMethod: 'cash.de.berlin.einundzwanzig',
    }

    expect(canOpenDispute(contract as Contract)).toBe(false)
  })

  it('returns true if view is seller and cancelation has been requested', () => {
    const contract: Partial<Contract> = {
      symmetricKey: 'symmetricKey',
      disputeActive: false,
      paymentMethod: 'paypal',
      cancelationRequested: true,
    }
    const view = 'seller'
    expect(canOpenDispute(contract as Contract, view)).toBe(true)
  })

  it('returns true if in all other cases', () => {
    const contract: Partial<Contract> = {
      symmetricKey: 'symmetricKey',
      disputeActive: false,
      paymentMethod: 'paypal',
    }

    expect(canOpenDispute(contract as Contract)).toBe(true)
    expect(canOpenDispute({ ...contract, paymentMethod: 'advcash' } as Contract)).toBe(true)
  })
})
