import { renderHook, waitFor } from 'test-utils'
import { NavigationAndQueryClientWrapper } from '../../../../tests/unit/helpers/CustomWrapper'
import { useYourTradesSetup } from './useYourTradesSetup'

const useRouteMock = jest.fn(() => ({
  params: {},
}))

jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const getContractSummariesMock = jest.fn().mockResolvedValue([[], null])
const getOfferSummariesMock = jest.fn().mockResolvedValue([[], null])
jest.mock('../../../utils/peachAPI', () => ({
  getContractSummaries: (...args: unknown[]) => getContractSummariesMock(...args),
  getOfferSummaries: (...args: unknown[]) => getOfferSummariesMock(...args),
}))

const wrapper = NavigationAndQueryClientWrapper

jest.useFakeTimers()

describe('useYourTradesSetup', () => {
  const tabs = [
    { display: 'buy', id: 'buy' },
    { display: 'sell', id: 'sell' },
    { display: 'history', id: 'history' },
  ]

  it('should return defaults', () => {
    const { result } = renderHook(useYourTradesSetup, { wrapper })
    expect(result.current).toEqual({
      isLoading: true,
      refetch: expect.any(Function),
      allOpenOffers: [],
      openOffers: { buy: [], sell: [] },
      pastOffers: [],
      tabs,
      currentTab: {
        display: 'buy',
        id: 'buy',
      },
      setCurrentTab: expect.any(Function),
    })
  })

  it('should call offer and contract summaries once', () => {
    renderHook(useYourTradesSetup, { wrapper })
    expect(getOfferSummariesMock).toHaveBeenCalledTimes(1)
    expect(getContractSummariesMock).toHaveBeenCalledTimes(1)
  })
  it('should not include unfunded past sell offers', async () => {
    const unfundedOffer = {
      id: '1',
      type: 'ask',
      creationDate: new Date('2021-01-01'),
      lastModified: new Date('2021-01-01'),
      amount: 21000,
      matches: [],
      prices: {
        EUR: 21000,
      },
      tradeStatus: 'offerCanceled',
      fundingTxId: undefined,
    }
    const fundedOffer = {
      id: '2',
      type: 'ask',
      creationDate: new Date('2021-01-01'),
      lastModified: new Date('2021-01-01'),
      amount: 21000,
      matches: [],
      prices: {
        EUR: 21000,
      },
      tradeStatus: 'offerCanceled',
      fundingTxId: '123',
    }

    getOfferSummariesMock.mockResolvedValueOnce([[unfundedOffer, fundedOffer], null])
    const { result } = renderHook(useYourTradesSetup, { wrapper })
    await waitFor(() => {
      expect(result.current.pastOffers).toEqual([fundedOffer])
    })
  })
})
