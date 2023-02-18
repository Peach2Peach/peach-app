import { getSellOfferFromContract } from '../../../../src/utils/contract'
import { getOffer } from '../../../../src/utils/offer'

jest.mock('../../../../src/utils/offer', () => ({
  getOffer: jest.fn(),
}))

describe('getSellOfferFromContract', () => {
  it('should return the correct sell offer', () => {
    const contract: Partial<Contract> = {
      id: '123-456',
    }

    const sellOffer: Partial<SellOffer> = {
      id: '123',
    }
    ;(getOffer as jest.Mock).mockReturnValue(sellOffer as SellOffer)

    expect(getSellOfferFromContract(contract as Contract)).toEqual(sellOffer)
    expect(getOffer).toHaveBeenCalledWith('123')
  })
})
