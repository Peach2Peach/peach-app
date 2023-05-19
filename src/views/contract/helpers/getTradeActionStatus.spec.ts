import { getTradeActionStatus } from './getTradeActionStatus'

const getSellOfferFromContractMock = jest.fn((..._args) => ({
  newOfferId: undefined as string | undefined,
  refunded: false,
  releaseTxId: null,
}))

jest.mock('../../../utils/contract', () => ({
  getSellOfferFromContract: (...args: any) => getSellOfferFromContractMock(...args),
}))

describe('getTradeActionStatus - buyer', () => {
  it('should return "not resolved" if the seller requested a cancelation and the contract is not canceled', () => {
    const contract = {
      canceled: false,
      cancelationRequested: true,
    } as any
    expect(getTradeActionStatus(contract, 'buyer')).toEqual('not resolved')
  })
  it('should return "not resolved" if the buyer won the dispute and the sats have not been released', () => {
    const contract = {
      canceled: false,
      cancelationRequested: false,
      disputeWinner: 'buyer',
      releaseTxId: undefined,
    } as any
    expect(getTradeActionStatus(contract, 'buyer')).toEqual('not resolved')
  })
  it('should return "paid out" if the buyer won the dispute and the sats have been released', () => {
    const contract = {
      canceled: false,
      cancelationRequested: false,
      disputeWinner: 'buyer',
      releaseTxId: 'releaseTxId',
    } as any
    expect(getTradeActionStatus(contract, 'buyer')).toEqual('paid out')
  })
  it('should return "seller refunded" in all other cases', () => {
    const contract = {
      canceled: true,
    } as any
    expect(getTradeActionStatus(contract, 'buyer')).toEqual('seller refunded')
    expect(getTradeActionStatus({ ...contract, cancelationRequested: true }, 'buyer')).toEqual('seller refunded')
  })
})

describe('getTradeActionStatus - seller', () => {
  it('should return "refunded" if the offer was refunded', () => {
    getSellOfferFromContractMock.mockReturnValueOnce({
      refunded: true,
      newOfferId: undefined,
      releaseTxId: null,
    })
    const contract = {} as any
    expect(getTradeActionStatus(contract, 'seller')).toEqual('refunded')
  })
  it('should return "re-published" if the offer was re-published', () => {
    getSellOfferFromContractMock.mockReturnValueOnce({
      newOfferId: 'newOfferId',
      refunded: false,
      releaseTxId: null,
    })
    const contract = {} as any
    expect(getTradeActionStatus(contract, 'seller')).toEqual('re-published')
  })
  it('should return "released to buyer" if the sats were released to the buyer', () => {
    const contract = {
      releaseTxId: 'releaseTxId',
    } as any
    expect(getTradeActionStatus(contract, 'seller')).toEqual('released to buyer')
  })
  it('should return "not resolved" in all other cases', () => {
    const contract = {} as any
    expect(getTradeActionStatus(contract, 'seller')).toEqual('not resolved')
  })
})
