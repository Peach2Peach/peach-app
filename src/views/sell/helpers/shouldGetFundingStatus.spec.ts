import { shouldGetFundingStatus } from './shouldGetFundingStatus'

describe('shouldGetFundingStatus', () => {
  test('should return true when the offer is not funded and all other conditions are met', () => {
    const offer: Partial<SellOffer> = {
      escrow: 'escrow',
      refunded: false,
      released: false,
      funding: { status: 'NULL' } as FundingStatus,
    }
    expect(shouldGetFundingStatus(offer as SellOffer)).toBe(true)
  })

  test('should return false when the offer is already funded', () => {
    const offer: Partial<SellOffer> = {
      escrow: 'escrow',
      refunded: false,
      released: false,
      funding: { status: 'FUNDED' } as FundingStatus,
    }
    expect(shouldGetFundingStatus(offer as SellOffer)).toBe(false)
  })

  test('should return false when the offer has been refunded', () => {
    const offer: Partial<SellOffer> = {
      escrow: 'escrow',
      refunded: true,
      released: false,
      funding: { status: 'FUNDED' } as FundingStatus,
    }
    expect(shouldGetFundingStatus(offer as SellOffer)).toBe(false)
  })

  test('should return false when the offer has been released', () => {
    const offer: Partial<SellOffer> = {
      escrow: 'escrow',
      refunded: false,
      released: true,
      funding: { status: 'FUNDED' } as FundingStatus,
    }
    expect(shouldGetFundingStatus(offer as SellOffer)).toBe(false)
  })

  test('should return false when the offer does not have escrow', () => {
    const offer: Partial<SellOffer> = {
      escrow: undefined,
      refunded: false,
      released: false,
      funding: { status: 'NULL' } as FundingStatus,
    }
    expect(shouldGetFundingStatus(offer as SellOffer)).toBe(false)
  })
})
