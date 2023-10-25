import { renderHook, waitFor } from 'test-utils'
import { estimatedFees } from '../../../tests/unit/data/bitcoinNetworkData'
import { unauthorizedError } from '../../../tests/unit/data/peachAPIData'
import { queryClient } from '../../../tests/unit/helpers/QueryClientWrapper'
import { placeholderFees, useFeeEstimate } from './useFeeEstimate'

jest.useFakeTimers()

const getFeeEstimateMock = jest.fn().mockResolvedValue([estimatedFees])
jest.mock('../../utils/peachAPI', () => ({
  getFeeEstimate: () => getFeeEstimateMock(),
}))

describe('useFeeEstimate', () => {
  afterEach(() => {
    queryClient.clear()
  })

  it('fetches fee estimates from API', async () => {
    const { result } = renderHook(useFeeEstimate)
    expect(result.current).toEqual({
      estimatedFees: placeholderFees,
      isLoading: true,
      error: null,
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current).toEqual({
      estimatedFees,
      isLoading: false,
      error: null,
    })
  })
  it('returns error if server did not return result', async () => {
    getFeeEstimateMock.mockResolvedValueOnce([null, unauthorizedError])
    const { result } = renderHook(useFeeEstimate)
    expect(result.current).toEqual({
      estimatedFees: placeholderFees,
      isLoading: true,
      error: null,
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current).toEqual({
      estimatedFees: placeholderFees,
      isLoading: false,
      error: new Error(unauthorizedError.error),
    })
  })
})
