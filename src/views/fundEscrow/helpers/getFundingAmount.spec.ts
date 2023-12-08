import { sellOffer } from '../../../../tests/unit/data/offerData'
import { getFundingAmount } from './getFundingAmount'

describe('getFundingAmount', () => {
  it('should get funding amount for a single sell offer', () => {
    expect(getFundingAmount(undefined, sellOffer.amount)).toEqual(sellOffer.amount)
  })
  it('should get funding amount for a multiple sell offers', () => {
    expect(getFundingAmount({ address: 'address1', offerIds: ['1', '2', '3'] }, sellOffer.amount)).toEqual(
      sellOffer.amount * 3,
    )
  })
  it('should return 0 if no sell offer has been passed', () => {
    expect(getFundingAmount(undefined)).toEqual(0)
  })
})
