import { act, renderHook, waitFor } from 'test-utils'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { createTestWallet } from '../../../../tests/unit/helpers/createTestWallet'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { useSyncWallet } from './useSyncWallet'

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))
const mockSyncWallet = jest.fn().mockResolvedValue(undefined)
jest.useFakeTimers()

describe('useSyncWallet', () => {
  beforeAll(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }))
    peachWallet.initialized = true
    peachWallet.syncWallet = mockSyncWallet
  })
  afterEach(() => {
    queryClient.clear()
  })
  it('should sync the wallet on mount', async () => {
    renderHook(useSyncWallet)
    await waitFor(() => {
      expect(mockSyncWallet).toHaveBeenCalled()
    })
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
    await waitFor(() => expect(mockSyncWallet).toHaveBeenCalled())

    await act(async () => {
      await result.current.refetch()
    })

    expect(mockSyncWallet).toHaveBeenCalledTimes(2)
  })
  it('should not call peachWallet.syncWallet if already syncing', async () => {
    const { result } = renderHook(useSyncWallet)

    act(() => {
      result.current.refetch()
      result.current.refetch()
    })
    await waitFor(() => expect(result.current.isFetching).toBe(false))
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
