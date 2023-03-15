import { getRequiredAction } from '.'

describe('getRequiredAction', () => {
  it('returns none if contract is null or canceled', () => {
    expect(getRequiredAction(null)).toBe('none')

    const canceledContract: Partial<Contract> = {
      id: '12-34',
      canceled: true,
      kycRequired: false,
      kycConfirmed: false,
      paymentMade: null,
      paymentConfirmed: null,
    }
    expect(getRequiredAction(canceledContract as Contract)).toBe('none')
  })

  it('returns kycResponse if kyc is required and not confirmed', () => {
    const contract: Partial<Contract> = {
      id: '12-34',
      canceled: false,
      kycRequired: true,
      kycConfirmed: false,
      paymentMade: null,
      paymentConfirmed: null,
    }
    expect(getRequiredAction(contract as Contract)).toBe('kycResponse')
  })

  it('returns sendPayment if payment has not been made', () => {
    const contract: Partial<Contract> = {
      id: '12-34',
      canceled: false,
      kycRequired: false,
      kycConfirmed: true,
      paymentMade: null,
      paymentConfirmed: null,
    }
    expect(getRequiredAction(contract as Contract)).toBe('sendPayment')
  })

  it('returns confirmPayment if payment has been made but not confirmed', () => {
    const contract: Partial<Contract> = {
      id: '12-34',
      canceled: false,
      kycRequired: false,
      kycConfirmed: true,
      paymentMade: new Date(),
      paymentConfirmed: null,
    }
    expect(getRequiredAction(contract as Contract)).toBe('confirmPayment')
  })

  it('returns none if contract does not require any action', () => {
    const contract: Partial<Contract> = {
      id: '12-34',
      canceled: false,
      kycRequired: false,
      kycConfirmed: true,
      paymentMade: new Date(),
      paymentConfirmed: new Date(),
    }
    expect(getRequiredAction(contract as Contract)).toBe('none')
  })
})
