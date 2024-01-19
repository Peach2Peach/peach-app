import { act, renderHook, waitFor } from 'test-utils'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { useSyncWallet } from './useSyncWallet'

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))
const mockSyncWallet = jest.fn().mockResolvedValue(undefined)
jest.mock('../../../utils/wallet/setWallet', () => ({
  peachWallet: {
    syncWallet: () => mockSyncWallet(),
  },
}))
jest.useFakeTimers()

describe('useSyncWallet', () => {
  afterEach(() => {
    queryClient.clear()
  })
  it('should set refreshing to true on refresh', async () => {
    const { result } = renderHook(useSyncWallet)
    act(() => {
      result.current.refetch()
    })

    expect(result.current.isFetching).toBe(true)
    await waitFor(() => expect(result.current.isFetching).toBe(false))
  })

  it('should call peachWallet.syncWallet on refresh', async () => {
    const { result } = renderHook(useSyncWallet)

    await act(async () => {
      await result.current.refetch()
    })

    expect(mockSyncWallet).toHaveBeenCalled()
  })

  it('should not call peachWallet.syncWallet if already refreshing', async () => {
    const { result } = renderHook(useSyncWallet)

    act(() => {
      result.current.refetch()
    })
    act(() => {
      result.current.refetch()
    })

    expect(mockSyncWallet).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(result.current.isFetching).toBe(false))
  })

  it('should set refreshing to false after refresh', async () => {
    const { result } = renderHook(useSyncWallet)
    await act(async () => {
      await result.current.refetch()
    })
    expect(mockSyncWallet).toHaveBeenCalledTimes(1)
  })

  it('should handle wallet sync errors', async () => {
    mockSyncWallet.mockImplementation(() => {
      throw new Error('error')
    })
    renderHook(useSyncWallet)

    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('WALLET_SYNC_ERROR')
    })
  })
})
