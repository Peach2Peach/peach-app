import { isChatActive } from './isChatActive'
import { contract } from '../../../../tests/unit/data/contractData'

// eslint-disable-next-line max-lines-per-function
describe('isChatActive', () => {
  const THIRTYDAYSINMS = 2592000000

  it('returns false if contract is falsy', () => {
    expect(isChatActive(null)).toBe(false)
  })

  it('returns true if isDisputeActive is true', () => {
    expect(
      isChatActive({
        ...contract,
        disputeActive: true,
      }),
    ).toBe(true)
  })

  it('returns true if trade is not cancelled and not complete', () => {
    expect(
      isChatActive({
        ...contract,
        disputeActive: false,
        canceled: false,
        paymentConfirmed: null,
      }),
    ).toBe(true)
  })

  it('returns false if trade is cancelled', () => {
    expect(
      isChatActive({
        ...contract,
        disputeActive: false,
        canceled: true,
      }),
    ).toBe(false)
  })

  it('returns false if trade is complete and 30 days have passed since payment was confirmed', () => {
    const testContract = {
      ...contract,
      disputeActive: false,
      canceled: false,
      paymentConfirmed: new Date(),
    }
    jest.spyOn(Date, 'now').mockReturnValue(testContract.paymentConfirmed.getTime() + THIRTYDAYSINMS + 1)
    expect(isChatActive(testContract)).toBe(false)
  })

  it('returns true if trade is complete and payment is confirmed and 30 days have not passed', () => {
    const testContract = {
      ...contract,
      disputeActive: false,
      canceled: false,
      paymentConfirmed: new Date(),
    }
    jest.spyOn(Date, 'now').mockReturnValue(testContract.paymentConfirmed.getTime() + THIRTYDAYSINMS - 1)
    expect(isChatActive(testContract)).toBe(true)
  })
})
