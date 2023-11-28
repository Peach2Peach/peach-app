import { getNavigationDestinationForOffer } from '..'

describe('getNavigationDestinationForOffer', () => {
  it('should navigate to offer', () => {
    const [destination, params] = getNavigationDestinationForOffer({
      id: '3',
      tradeStatus: 'offerCanceled',
    })

    expect(destination).toBe('offer')
    expect(params).toEqual({ offerId: '3' })
  })
  it('should navigate to search', () => {
    const [destination, params] = getNavigationDestinationForOffer({
      id: '3',
      tradeStatus: 'hasMatchesAvailable',
    })

    expect(destination).toBe('search')
    expect(params).toEqual({ offerId: '3' })
  })
  it('should navigate to fundEscrow', () => {
    const [destination, params] = getNavigationDestinationForOffer({
      id: '3',
      tradeStatus: 'fundEscrow',
    })

    expect(destination).toBe('fundEscrow')
    expect(params).toEqual({ offerId: '3' })

    const [destination2, params2] = getNavigationDestinationForOffer({
      id: '4',
      tradeStatus: 'escrowWaitingForConfirmation',
    })

    expect(destination2).toBe('fundEscrow')
    expect(params2).toEqual({ offerId: '4' })
  })
  it('should navigate to wrongFundingAmount', () => {
    const [destination, params] = getNavigationDestinationForOffer({
      id: '3',
      tradeStatus: 'fundingAmountDifferent',
    })

    expect(destination).toBe('wrongFundingAmount')
    expect(params).toEqual({ offerId: '3' })
  })
  it('should navigate to yourTrades as fallback', () => {
    const [destination, params] = getNavigationDestinationForOffer({
      id: '3',
      tradeStatus: 'dispute',
    })

    expect(destination).toBe('home')
    expect(params).toEqual({ screen: 'yourTrades' })
  })
})
