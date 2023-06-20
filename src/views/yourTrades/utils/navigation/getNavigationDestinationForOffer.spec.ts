import { getNavigationDestinationForOffer } from '..'

// eslint-disable-next-line max-lines-per-function
describe('getNavigationDestinationForOffer', () => {
  it('should navigate to offer', () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'offerCanceled',
    }
    const [destination, params] = getNavigationDestinationForOffer(offerSummary as OfferSummary)

    expect(destination).toBe('offer')
    expect(params).toEqual({ offerId: '3' })
  })
  it('should navigate to search', () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'hasMatchesAvailable',
    }

    const [destination, params] = getNavigationDestinationForOffer(offerSummary as OfferSummary)

    expect(destination).toBe('search')
    expect(params).toEqual({ offerId: '3' })
  })
  it('should navigate to fundEscrow', () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'fundEscrow',
    }

    const [destination, params] = getNavigationDestinationForOffer(offerSummary as OfferSummary)

    expect(destination).toBe('fundEscrow')
    expect(params).toEqual({ offerId: offerSummary.id })

    const offerSummary2: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'escrowWaitingForConfirmation',
    }

    const [destination2, params2] = getNavigationDestinationForOffer(offerSummary2 as OfferSummary)

    expect(destination2).toBe('fundEscrow')
    expect(params2).toEqual({ offerId: offerSummary.id })
  })
  it('should navigate to wrongFundingAmount', () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'fundingAmountDifferent',
    }

    const [destination, params] = getNavigationDestinationForOffer(offerSummary as OfferSummary)

    expect(destination).toBe('wrongFundingAmount')
    expect(params).toEqual({ offerId: offerSummary.id })
  })
  it('should navigate to yourTrades as fallback', () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'dispute',
    }

    const [destination, params] = getNavigationDestinationForOffer(offerSummary as OfferSummary)

    expect(destination).toBe('yourTrades')
    expect(params).toEqual(undefined)
  })

  it('should navigate to setRefundWallet', () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'refundAddressRequired',
    }

    const [destination, params] = getNavigationDestinationForOffer(offerSummary as OfferSummary)

    expect(destination).toBe('setRefundWallet')
    expect(params).toEqual({ offerId: offerSummary.id })
  })
})
