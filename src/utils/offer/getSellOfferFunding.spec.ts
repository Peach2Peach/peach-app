import { sellOffer, sellOfferLiquid } from '../../../tests/unit/data/offerData'
import { getSellOfferFunding } from './getSellOfferFunding'

describe('getSellOfferFunding', () => {
  it('should return bitcoin funding status if escrow type is bitcoin', () => {
    expect(getSellOfferFunding(sellOffer)).toEqual(sellOffer.funding)
  })
  it('should return liquid funding status if escrow type is liquid', () => {
    expect(getSellOfferFunding(sellOfferLiquid)).toEqual(sellOfferLiquid.fundingLiquid)
  })
})
