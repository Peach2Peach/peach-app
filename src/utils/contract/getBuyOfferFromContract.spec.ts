import { getBuyOfferFromContract } from './getBuyOfferFromContract'

const getOfferMock = jest.fn()
jest.mock('../offer/getOffer', () => ({
  getOffer: (...args: unknown[]) => getOfferMock(...args),
}))

describe('getBuyOfferFromContract', () => {
  it('should return the correct buy offer', () => {
    const contract: Partial<Contract> = {
      id: '123-456',
    }

    const buyOffer: Partial<BuyOffer> = {
      id: '456',
    }
    getOfferMock.mockReturnValue(buyOffer as BuyOffer)

    expect(getBuyOfferFromContract(contract as Contract)).toEqual(buyOffer)
    expect(getOfferMock).toHaveBeenCalledWith('456')
  })
})
