import { renderHook, waitFor } from 'test-utils'
import { offerSummary } from '../../../tests/unit/data/offerSummaryData'
import { unauthorizedError } from '../../../tests/unit/data/peachAPIData'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { defaultTradeSummaryState, useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { useOfferSummaries } from './useOfferSummaries'

const getOfferSummariesMock = jest.fn().mockResolvedValue([[offerSummary]])
jest.mock('../../utils/peachAPI', () => ({
  getOfferSummaries: () => getOfferSummariesMock(),
}))

jest.useFakeTimers()

describe('useOfferSummaries', () => {
  const localOfferSummary: OfferSummary = { ...offerSummary, tradeStatus: 'tradeCanceled' }

  beforeEach(() => {
    useTradeSummaryStore.setState(defaultTradeSummaryState)
  })

  afterEach(() => {
    queryClient.clear()
  })
  it('fetches offer summaries from API and stores in local store', async () => {
    const { result } = renderHook(useOfferSummaries)

    expect(result.current.offers).toEqual([])
    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => expect(queryClient.isFetching()).toBe(0))

    expect(result.current.offers).toEqual([offerSummary])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.refetch).toBeInstanceOf(Function)
    expect(result.current.error).toBeFalsy()

    expect(useTradeSummaryStore.getState().offers).toEqual([offerSummary])
  })
  it('returns local offer summaries first if given', async () => {
    useTradeSummaryStore.setState({ offers: [localOfferSummary], lastModified: new Date() })
    const { result } = renderHook(useOfferSummaries)

    expect(result.current.offers).toEqual([localOfferSummary])
    expect(result.current.isLoading).toBeFalsy()
    expect(queryClient.isFetching()).toBeTruthy()

    await waitFor(() => expect(queryClient.isFetching()).toBe(0))

    expect(result.current.offers).toEqual([offerSummary])
  })
  it('returns local offer summary if given and server did not return result', async () => {
    useTradeSummaryStore.setState({ offers: [localOfferSummary], lastModified: new Date() })
    getOfferSummariesMock.mockResolvedValueOnce([null])

    const { result } = renderHook(useOfferSummaries)

    expect(result.current.offers).toEqual([localOfferSummary])
    expect(result.current.isLoading).toBeFalsy()

    await waitFor(() => expect(queryClient.isFetching()).toBe(0))
    expect(result.current.offers).toEqual([localOfferSummary])
  })
  it('returns error if server did return error and no local offer summaries exists', async () => {
    getOfferSummariesMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useOfferSummaries)

    expect(result.current.offers).toEqual([])
    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => expect(queryClient.isFetching()).toBe(0))

    expect(result.current.offers).toEqual([])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.error).toEqual(new Error(unauthorizedError.error))
  })
})
