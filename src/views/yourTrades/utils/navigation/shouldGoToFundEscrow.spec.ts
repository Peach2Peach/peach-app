import { shouldGoToFundEscrow } from './shouldGoToFundEscrow'

describe('shouldGoToFundEscrow', () => {
  it('should return true for offerCanceled', () => {
    expect(shouldGoToFundEscrow('fundEscrow')).toBe(true)
    expect(shouldGoToFundEscrow('escrowWaitingForConfirmation')).toBe(true)
  })
  it('should return false for escrowWaitingForConfirmationother statuses', () => {
    expect(shouldGoToFundEscrow('dispute')).toBe(false)
    expect(shouldGoToFundEscrow('rateUser')).toBe(false)
    expect(shouldGoToFundEscrow('searchingForPeer')).toBe(false)
    expect(shouldGoToFundEscrow('hasMatchesAvailable')).toBe(false)
  })
})
