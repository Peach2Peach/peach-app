import { act, renderHook, waitFor } from '@testing-library/react-native'
import { useSyncWallet } from './useSyncWallet'

const mockSyncWallet = jest.fn().mockResolvedValue(undefined)
jest.mock('../../../utils/wallet/setWallet', () => ({
  peachWallet: {
    syncWallet: () => mockSyncWallet(),
  },
}))

describe('useSyncWallet', () => {
  it('should return correct default values', () => {
    const { result } = renderHook(useSyncWallet)

    expect(result.current).toStrictEqual({
      refresh: expect.any(Function),
      isRefreshing: false,
    })
  })

  it('should set refreshing to true on refresh', async () => {
    const { result } = renderHook(useSyncWallet)

    act(() => {
      result.current.refresh()
    })

    expect(result.current.isRefreshing).toBe(true)
    await waitFor(() => expect(result.current.isRefreshing).toBe(false))
  })

  it('should call peachWallet.syncWallet on refresh', async () => {
    const { result } = renderHook(useSyncWallet)

    await act(async () => {
      await result.current.refresh()
    })

    expect(mockSyncWallet).toHaveBeenCalled()
  })

  it('should not call peachWallet.syncWallet if already refreshing', async () => {
    const { result } = renderHook(useSyncWallet)

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
    const { result } = renderHook(useSyncWallet)

    await act(async () => {
      await result.current.refresh()
    })

    expect(result.current.isRefreshing).toBe(false)
  })
})
