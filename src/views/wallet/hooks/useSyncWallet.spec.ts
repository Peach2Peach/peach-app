import { renderHook, act } from '@testing-library/react-hooks'
import { useSyncWallet } from './useSyncWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { BIP32Interface } from 'bip32'

describe('useSyncWallet', () => {
  const wallet = {} as unknown as BIP32Interface
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should initialize with refreshing set to false', () => {
    const fakeWallet = new PeachWallet({ wallet })
    fakeWallet.synced = true
    setPeachWallet(fakeWallet)
    const { result } = renderHook(() => useSyncWallet())

    expect(result.current.isRefreshing).toBe(false)
  })

  it('should call peachWallet.syncWallet on refresh', () => {
    const fakeWallet = new PeachWallet({ wallet })
    fakeWallet.synced = true
    fakeWallet.syncWallet = jest.fn()
    setPeachWallet(fakeWallet)
    const { result } = renderHook(() => useSyncWallet())

    act(() => {
      result.current.refresh()
    })

    expect(fakeWallet.syncWallet).toHaveBeenCalled()
  })

  it('should set refreshing to false after refresh', () => {
    const fakeWallet = new PeachWallet({ wallet })
    fakeWallet.synced = true
    fakeWallet.syncWallet = jest.fn().mockImplementation((callback) => callback())

    setPeachWallet(fakeWallet)
    const { result } = renderHook(() => useSyncWallet())

    act(() => {
      result.current.refresh()
    })

    expect(result.current.isRefreshing).toBe(false)
  })

  it('should not call peachWallet.syncWallet if already refreshing', () => {
    const fakeWallet = new PeachWallet({ wallet })
    fakeWallet.synced = false
    fakeWallet.syncWallet = jest.fn()
    setPeachWallet(fakeWallet)
    const { result } = renderHook(() => useSyncWallet())

    act(() => {
      result.current.refresh()
    })
    act(() => {
      result.current.refresh()
    })

    expect(fakeWallet.syncWallet).toHaveBeenCalledTimes(1)
  })
})
