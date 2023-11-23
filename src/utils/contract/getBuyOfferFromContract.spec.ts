import { getOffer } from '../offer'
import { getBuyOfferFromContract } from './getBuyOfferFromContract'

jest.mock('../offer', () => ({
  getOffer: jest.fn(),
}))

describe('getBuyOfferFromContract', () => {
  it('should return the correct buy offer', () => {
    const contract: Partial<Contract> = {
      id: '123-456',
    }

    const buyOffer: Partial<BuyOffer> = {
      id: '456',
    }
    ;(getOffer as jest.Mock).mockReturnValue(buyOffer as BuyOffer)

    expect(getBuyOfferFromContract(contract as Contract)).toEqual(buyOffer)
    expect(getOffer).toHaveBeenCalledWith('456')
  })
})
