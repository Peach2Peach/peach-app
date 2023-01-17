import { getOffer } from '../../../../src/utils/offer'
import { getNavigationDestinationForOffer } from '../../../../src/views/yourTrades/utils'

jest.mock('../../../../src/utils/offer', () => ({
  getOffer: jest.fn(),
}))

// eslint-disable-next-line max-lines-per-function
describe('getNavigationDestinationForOffer', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should navigate to offer', () => {
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'searchingForPeer',
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
    expect(params).toEqual(undefined)
  })
  it('should navigate to setting return address', () => {
    const offer = {
      id: '3',
    } as SellOffer
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'returnAddressRequired',
    }

    ;(<jest.Mock>getOffer).mockReturnValue(offer)

    const [destination, params] = getNavigationDestinationForOffer(offerSummary as OfferSummary)

    expect(destination).toBe('setReturnAddress')
    expect(params).toEqual({ offer })
  })
  it('should navigate to fundEscrow', () => {
    const offer = {
      id: '3',
    } as SellOffer
    const offerSummary: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'fundEscrow',
    }

    ;(<jest.Mock>getOffer).mockReturnValue(offer)
    const [destination, params] = getNavigationDestinationForOffer(offerSummary as OfferSummary)

    expect(destination).toBe('fundEscrow')
    expect(params).toEqual({ offer })

    const offerSummary2: Partial<OfferSummary> = {
      id: '3',
      tradeStatus: 'escrowWaitingForConfirmation',
    }

    const [destination2, params2] = getNavigationDestinationForOffer(offerSummary2 as OfferSummary)

    expect(destination2).toBe('fundEscrow')
    expect(params2).toEqual({ offer })
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
})
