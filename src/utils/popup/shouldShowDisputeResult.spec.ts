import { shouldShowDisputeResult } from '.'

describe('shouldShowDisputeResult', () => {
  it('returns true if dispute result is in', () => {
    const contract: Partial<Contract> = {
      disputeActive: false,
      disputeResolvedDate: new Date(),
      disputeResultAcknowledged: false,
    }
    expect(shouldShowDisputeResult(contract as Contract)).toBe(true)
  })

  it('returns false if dispute is active', () => {
    const contract: Partial<Contract> = {
      disputeActive: true,
      disputeResolvedDate: new Date(),
      disputeResultAcknowledged: false,
    }
    expect(shouldShowDisputeResult(contract as Contract)).toBe(false)
  })

  it('returns false if disputeResolvedDate is not present', () => {
    const contract: Partial<Contract> = {
      disputeActive: false,
      disputeResolvedDate: null,
      disputeResultAcknowledged: false,
    }
    expect(shouldShowDisputeResult(contract as Contract)).toBe(false)
  })

  it('returns false if disputeResultAcknowledged is true', () => {
    const contract: Partial<Contract> = {
      disputeActive: false,
      disputeResolvedDate: new Date(),
      disputeResultAcknowledged: true,
    }
    expect(shouldShowDisputeResult(contract as Contract)).toBe(false)
  })
})
