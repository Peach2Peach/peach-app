import { getNavigationDestination } from '../../../../src/views/yourTrades/utils/getNavigationDestination'

// eslint-disable-next-line max-lines-per-function
describe('getNavigationDestination', () => {
  it('should navigate to offer', () => {
    const offer = {
      id: 'offerId',
    } as SellOffer
    const offerStatus = {
      requiredAction: 'acknowledgeDisputeResult',
      status: 'offerPublished',
    } as TradeStatus
    const contract = null

    const [destination, params] = getNavigationDestination(offer, offerStatus, contract)

    expect(destination).toBe('offer')
    expect(params).toEqual({ offerId: offer.id })
  })

  it('should navigate to contract', () => {
    const offer = {
      id: 'offerId',
    } as SellOffer
    const offerStatus = {
      requiredAction: 'acknowledgeDisputeResult',
      status: 'contractCreated',
    } as TradeStatus
    const contract = {
      id: 'contractId',
    } as Contract

    const [destination, params] = getNavigationDestination(offer, offerStatus, contract)

    expect(destination).toBe('contract')
    expect(params).toEqual({ contractId: contract.id })
  })

  it('should navigate to tradeComplete', () => {
    const offer = {
      id: 'offerId',
    } as SellOffer
    const offerStatus = {
      requiredAction: 'rate',
      status: 'tradeCompleted',
    } as TradeStatus
    const contract = {
      id: 'contractId',
      disputeWinner: null,
    } as unknown as Contract

    const [destination, params] = getNavigationDestination(offer, offerStatus, contract)

    expect(destination).toBe('tradeComplete')
    expect(params).toEqual({ contract })
  })

  it('should navigate to setReturnAddress', () => {
    const offer = {
      id: 'offerId',
      type: 'ask',
      returnAddressRequired: true,
    } as SellOffer
    const offerStatus = {
      requiredAction: 'acknowledgeDisputeResult',
      status: 'returnAddressRequired',
    } as TradeStatus
    const contract = null

    const [destination, params] = getNavigationDestination(offer, offerStatus, contract)

    expect(destination).toBe('setReturnAddress')
    expect(params).toEqual({ offer })
  })

  it('should navigate to search', () => {
    const offer = {
      id: 'offerId',
      type: 'ask',
      returnAddressRequired: false,
      online: false,
      funding: {
        status: 'FUNDED',
      },
    } as SellOffer
    const offerStatus = {
      requiredAction: 'checkMatches',
      status: 'match',
    } as TradeStatus
    const contract = null

    const [destination, params] = getNavigationDestination(offer, offerStatus, contract)

    expect(destination).toBe('search')
    expect(params).toEqual({ offerId: offer.id })

    const offer2 = {
      id: 'offerId',
      type: 'bid',
      returnAddressRequired: false,
      online: true,
    } as unknown as BuyOffer
    const offerStatus2 = {
      requiredAction: 'acknowledgeDisputeResult',
      status: 'escrowWaitingForConfirmation',
    } as TradeStatus
    const contract2 = null

    const [destination2, params2] = getNavigationDestination(offer2, offerStatus2, contract2)

    expect(destination2).toBe('search')
    expect(params2).toEqual({ offerId: offer2.id })
  })

  it('should navigate to fundEscrow', () => {
    const offer = {
      id: 'offerId',
      returnAddressRequired: false,
      type: 'ask',
      online: false,
      funding: {
        status: 'unfunded',
      },
    } as unknown as SellOffer
    const offerStatus = {
      requiredAction: 'acknowledgeDisputeResult',
      status: 'escrowWaitingForConfirmation',
    } as TradeStatus
    const contract = null

    const [destination, params] = getNavigationDestination(offer, offerStatus, contract)

    expect(destination).toBe('fundEscrow')
    expect(params).toEqual({ offer })
  })

  it('should navigate to yourTrades', () => {
    const offer = {
      id: 'offerId',
      returnAddressRequired: false,
      online: false,
      type: 'bid',
    } as unknown as BuyOffer
    const offerStatus = {
      requiredAction: 'acknowledgeDisputeResult',
      status: 'contractCreated',
    } as TradeStatus
    const contract = null

    const [destination, params] = getNavigationDestination(offer, offerStatus, contract)

    expect(destination).toBe('yourTrades')
    expect(params).toEqual({})
  })
})
