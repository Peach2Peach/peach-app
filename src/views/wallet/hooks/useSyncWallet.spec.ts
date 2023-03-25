import { renderHook, act } from '@testing-library/react-hooks'
import { useSyncWallet } from './useSyncWallet'

const mockSyncWallet = jest.fn()
jest.mock('../../../utils/wallet/setWallet', () => ({
  peachWallet: {
    syncWallet: (...args: any) => mockSyncWallet(...args),
  },
}))

describe('useSyncWallet', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should return correct default values', () => {
    const { result } = renderHook(useSyncWallet)

    expect(result.current).toStrictEqual({
      refresh: expect.any(Function),
      isRefreshing: false,
    })
  })

  it('should set refreshing to true on refresh', () => {
    const { result } = renderHook(useSyncWallet)

    act(() => {
      result.current.refresh()
    })

    expect(result.current.isRefreshing).toBe(true)
  })

  it('should call peachWallet.syncWallet on refresh', () => {
    const { result } = renderHook(useSyncWallet)

    act(() => {
      result.current.refresh()
    })

    expect(mockSyncWallet).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should not call peachWallet.syncWallet if already refreshing', () => {
    const { result } = renderHook(useSyncWallet)

    act(() => {
      result.current.refresh()
    })
    act(() => {
      result.current.refresh()
    })

    expect(mockSyncWallet).toHaveBeenCalledTimes(1)
  })

  it('should set refreshing to false after refresh', () => {
    mockSyncWallet.mockImplementationOnce((callback: any) => callback())
    const { result } = renderHook(useSyncWallet)

    act(() => {
      result.current.refresh()
    })

    expect(result.current.isRefreshing).toBe(false)
  })
})
