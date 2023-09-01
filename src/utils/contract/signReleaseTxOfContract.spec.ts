import { signReleaseTxOfContract } from './signReleaseTxOfContract'
const getSellOfferFromContractMock = jest.fn()
const getEscrowWalletForOfferMock = jest.fn()

jest.mock('./index', () => ({
  getSellOfferFromContract: jest.fn((...args: unknown[]) => getSellOfferFromContractMock(...args)),
  verifyAndSignReleaseTx: jest.fn(() => ['tx', null]),
}))
jest.mock('../wallet', () => ({
  getEscrowWalletForOffer: jest.fn((...args: unknown[]) => getEscrowWalletForOfferMock(...args)),
}))

describe('signReleaseTxOfContract', () => {
  it('should call verifyAndSignReleaseTx with the correct params', () => {
    const contract = { id: 'contractId' } as Contract
    const sellOffer = { id: 'sellOfferId' }
    getSellOfferFromContractMock.mockReturnValueOnce(sellOffer)
    getEscrowWalletForOfferMock.mockReturnValueOnce('wallet')
    const result = signReleaseTxOfContract(contract)
    expect(getSellOfferFromContractMock).toHaveBeenCalledWith(contract)
    expect(getEscrowWalletForOfferMock).toHaveBeenCalledWith(sellOffer)
    expect(result).toEqual(['tx', null])
  })
})
