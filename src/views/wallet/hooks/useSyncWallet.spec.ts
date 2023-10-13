import { act, renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useSyncWallet } from './useSyncWallet'

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner:
    () =>
      (...args: unknown[]) =>
        showErrorBannerMock(...args),
}))
const mockSyncWallet = jest.fn().mockResolvedValue(undefined)
jest.mock('../../../utils/wallet/setWallet', () => ({
  peachWallet: {
    syncWallet: () => mockSyncWallet(),
  },
}))

const wrapper = NavigationWrapper

describe('useSyncWallet', () => {
  it('should return correct default values', () => {
    const { result } = renderHook(useSyncWallet, { wrapper })

    expect(result.current).toStrictEqual({
      refresh: expect.any(Function),
      isRefreshing: false,
    })
  })

  it('should set refreshing to true on refresh', async () => {
    const { result } = renderHook(useSyncWallet, { wrapper })

    act(() => {
      result.current.refresh()
    })

    expect(result.current.isRefreshing).toBe(true)
    await waitFor(() => expect(result.current.isRefreshing).toBe(false))
  })

  it('should call peachWallet.syncWallet on refresh', async () => {
    const { result } = renderHook(useSyncWallet, { wrapper })

    await act(() => result.current.refresh())

    expect(mockSyncWallet).toHaveBeenCalled()
  })

  it('should not call peachWallet.syncWallet if already refreshing', async () => {
    const { result } = renderHook(useSyncWallet, { wrapper })

    act(() => {
      result.current.refresh()
    })
    act(() => {
      result.current.refresh()
    })

    expect(mockSyncWallet).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(result.current.isRefreshing).toBe(false))
  })

  it('should set refreshing to false after refresh', async () => {
    const { result } = renderHook(useSyncWallet, { wrapper })
    await act(() => result.current.refresh())
    expect(mockSyncWallet).toHaveBeenCalledTimes(1)
  })

  it('should handle wallet sync errors', async () => {
    mockSyncWallet.mockImplementationOnce(() => {
      throw new Error('error')
    })
    const { result } = renderHook(useSyncWallet, { wrapper })
    await act(() => result.current.refresh())
    expect(showErrorBannerMock).toHaveBeenCalledWith('WALLET_SYNC_ERROR')
  })
})
