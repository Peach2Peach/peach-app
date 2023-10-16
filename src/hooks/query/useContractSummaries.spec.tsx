import { renderHook, waitFor } from 'test-utils'
import { contractSummary } from '../../../tests/unit/data/contractSummaryData'
import { unauthorizedError } from '../../../tests/unit/data/peachAPIData'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { defaultTradeSummaryState, useTradeSummaryStore } from '../../store/tradeSummaryStore'
import { useContractSummaries } from './useContractSummaries'

const getContractSummariesMock = jest.fn().mockResolvedValue([[contractSummary]])
jest.mock('../../utils/peachAPI', () => ({
  getContractSummaries: () => getContractSummariesMock(),
}))

jest.useFakeTimers()

describe('useContractSummaries', () => {
  const localContractSumary: ContractSummary = { ...contractSummary, tradeStatus: 'tradeCanceled' }

  beforeEach(() => {
    useTradeSummaryStore.setState(defaultTradeSummaryState)
  })

  afterEach(() => {
    queryClient.clear()
  })
  it('fetches contract summaries from API and save in local store', async () => {
    const { result } = renderHook(useContractSummaries)

    expect(result.current.contracts).toEqual([])
    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => expect(result.current.isFetching).toBe(false))

    expect(result.current.contracts).toEqual([contractSummary])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.refetch).toBeInstanceOf(Function)
    expect(result.current.error).toBeFalsy()
    expect(useTradeSummaryStore.getState().contracts).toEqual([contractSummary])
  })
  it('returns local contract summaries first if given', async () => {
    useTradeSummaryStore.setState({ contracts: [localContractSumary], lastModified: new Date() })
    const { result } = renderHook(useContractSummaries)

    expect(result.current.contracts).toEqual([localContractSumary])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.isFetching).toBeTruthy()

    await waitFor(() => expect(result.current.isFetching).toBe(false))

    expect(result.current.contracts).toEqual([contractSummary])
  })
  it('returns local contract if given and server did not return result', async () => {
    useTradeSummaryStore.setState({ contracts: [localContractSumary], lastModified: new Date() })
    getContractSummariesMock.mockResolvedValueOnce([null])

    const { result } = renderHook(useContractSummaries)

    expect(result.current.contracts).toEqual([localContractSumary])
    expect(result.current.isLoading).toBeFalsy()

    await waitFor(() => expect(result.current.isFetching).toBe(false))
    expect(result.current.contracts).toEqual([localContractSumary])
  })
  it('returns error if server did return error and no local contract summaries exists', async () => {
    getContractSummariesMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useContractSummaries)

    expect(result.current.contracts).toEqual([])
    expect(result.current.isLoading).toBeTruthy()

    await waitFor(() => expect(result.current.isFetching).toBe(false))

    expect(result.current.contracts).toEqual([])
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.error).toEqual(new Error(unauthorizedError.error))
  })
})
