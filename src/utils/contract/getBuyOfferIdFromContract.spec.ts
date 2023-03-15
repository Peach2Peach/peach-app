import { getBuyOfferIdFromContract } from '.'

describe('getBuyOfferIdFromContract', () => {
  it('should return the correct buy offer id', () => {
    const contract: Partial<Contract> = {
      id: '123-456',
    }

    expect(getBuyOfferIdFromContract(contract as Contract)).toEqual('456')
  })
})
