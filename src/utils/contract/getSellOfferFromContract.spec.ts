import { getOffer } from '../offer'
import { getSellOfferFromContract } from './getSellOfferFromContract'

jest.mock('../offer', () => ({
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
