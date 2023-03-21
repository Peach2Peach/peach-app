import { renderHook, act } from '@testing-library/react-hooks'
import { useSyncWallet } from './useSyncWallet'

jest.mock('../../../utils/wallet/setWallet', () => ({
  peachWallet: {
    synced: true,
    syncWallet: jest.fn(() => Promise.resolve()),
  },
}))

describe('useSyncWallet', () => {
  it('should initialize with refreshing set to false if wallet is synced', () => {
    const { result } = renderHook(() => useSyncWallet())

    expect(result.current.refreshing).toBe(false)
  })

  it('should initialize with refreshing set to true if wallet is not synced', () => {
    jest.spyOn(require('../../../utils/wallet/setWallet'), 'peachWallet', 'get').mockReturnValue({ synced: false })

    const { result } = renderHook(() => useSyncWallet())

    expect(result.current.refreshing).toBe(true)
  })

  it('should call peachWallet.syncWallet on refresh', async () => {
    const { result } = renderHook(() => useSyncWallet())

    await act(async () => {
      await result.current.refresh()
    })

    expect(require('../../../utils/wallet/setWallet').peachWallet.syncWallet).toHaveBeenCalled()
  })

  it('should set refreshing to false after refresh', async () => {
    const { result } = renderHook(() => useSyncWallet())

    await act(async () => {
      await result.current.refresh()
    })

    expect(result.current.refreshing).toBe(false)
  })

  it('should not call peachWallet.syncWallet if already refreshing', async () => {
    const { result } = renderHook(() => useSyncWallet())

    result.current.refreshing = true

    await act(async () => {
      await result.current.refresh()
    })

    expect(require('../../../utils/wallet/setWallet').peachWallet.syncWallet).not.toHaveBeenCalled()
  })
})
