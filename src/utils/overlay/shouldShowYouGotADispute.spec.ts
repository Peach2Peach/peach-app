import { shouldShowYouGotADispute } from '.'

describe('shouldShowYouGotADispute', () => {
  it('returns true if user got a dispute', () => {
    const contract: Partial<Contract> = {
      disputeActive: true,
      disputeInitiator: 'abc',
      disputeAcknowledgedByCounterParty: false,
    }
    const account: Partial<Account> = {
      publicKey: 'def',
    }
    expect(shouldShowYouGotADispute(contract as Contract, account as Account)).toBe(true)
  })

  it('returns false if dispute is not active', () => {
    const contract: Partial<Contract> = {
      disputeActive: false,
      disputeInitiator: 'abc',
      disputeAcknowledgedByCounterParty: false,
    }
    const account: Partial<Account> = {
      publicKey: 'def',
    }
    expect(shouldShowYouGotADispute(contract as Contract, account as Account)).toBe(false)
  })

  it('returns false if dispute initiator is the same as account publicKey', () => {
    const contract: Partial<Contract> = {
      disputeActive: true,
      disputeInitiator: 'def',
      disputeAcknowledgedByCounterParty: false,
    }
    const account: Partial<Account> = {
      publicKey: 'def',
    }
    expect(shouldShowYouGotADispute(contract as Contract, account as Account)).toBe(false)
  })
})
