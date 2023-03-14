import { shouldShowPaymentTimerHasRunOut } from '.'

// eslint-disable-next-line max-lines-per-function
describe('shouldShowPaymentTimerHasRunOut', () => {
  it('returns true when the payment timer has run out', () => {
    const contract: Partial<Contract> = {
      paymentExpectedBy: new Date(Date.now() - 3600000),
      paymentMade: null,
      canceled: false,
      disputeActive: false,
      disputeWinner: undefined,
    }

    expect(shouldShowPaymentTimerHasRunOut(contract as Contract)).toBe(true)
  })

  it('returns false when the payment timer has not run out', () => {
    const contract: Partial<Contract> = {
      paymentExpectedBy: new Date(Date.now() + 3600000),
      paymentMade: null,
      canceled: false,
      disputeActive: false,
      disputeWinner: undefined,
    }

    expect(shouldShowPaymentTimerHasRunOut(contract as Contract)).toBe(false)
  })

  it('returns false when the payment has been made', () => {
    const contract: Partial<Contract> = {
      paymentExpectedBy: new Date(Date.now() - 3600000),
      paymentMade: new Date(),
      canceled: false,
      disputeActive: false,
      disputeWinner: undefined,
    }

    expect(shouldShowPaymentTimerHasRunOut(contract as Contract)).toBe(false)
  })

  it('returns false when the contract has been canceled', () => {
    const contract: Partial<Contract> = {
      paymentExpectedBy: new Date(Date.now() - 3600000),
      paymentMade: null,
      canceled: true,
      disputeActive: false,
      disputeWinner: undefined,
    }

    expect(shouldShowPaymentTimerHasRunOut(contract as Contract)).toBe(false)
  })

  it('returns false when a dispute is active', () => {
    const contract: Partial<Contract> = {
      paymentExpectedBy: new Date(Date.now() - 3600000),
      paymentMade: null,
      canceled: false,
      disputeActive: true,
      disputeWinner: undefined,
    }

    expect(shouldShowPaymentTimerHasRunOut(contract as Contract)).toBe(false)
  })

  it('returns false when a dispute has been resolved', () => {
    const contract: Partial<Contract> = {
      paymentExpectedBy: new Date(Date.now() - 3600000),
      paymentMade: null,
      canceled: false,
      disputeActive: false,
      disputeWinner: 'seller',
    }

    expect(shouldShowPaymentTimerHasRunOut(contract as Contract)).toBe(false)
  })
})
