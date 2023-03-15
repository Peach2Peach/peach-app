import { shouldRateCounterParty } from '.'

describe('shouldRateCounterParty', () => {
  it('should return true when ratingSeller is missing and view is buyer', () => {
    const contract: Partial<Contract> = { ratingBuyer: 1 }
    const view = 'buyer'
    const result = shouldRateCounterParty(contract as Contract, view)
    expect(result).toBe(true)
  })

  it('should return true when ratingBuyer is missing and view is seller', () => {
    const contract: Partial<Contract> = { ratingSeller: 1 }
    const view = 'seller'
    const result = shouldRateCounterParty(contract as Contract, view)
    expect(result).toBe(true)
  })

  it('should return false when ratingSeller is present and view is buyer', () => {
    const contract: Partial<Contract> = { ratingSeller: 1, ratingBuyer: 1 }
    const view = 'buyer'
    const result = shouldRateCounterParty(contract as Contract, view)
    expect(result).toBe(false)
  })

  it('should return false when ratingBuyer is present and view is seller', () => {
    const contract: Partial<Contract> = { ratingSeller: 1, ratingBuyer: 1 }
    const view = 'seller'
    const result = shouldRateCounterParty(contract as Contract, view)
    expect(result).toBe(false)
  })
})
