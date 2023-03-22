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
  it('should initialize with refreshing set to false if wallet is synced', () => {
    const fakeWallet = new PeachWallet({ wallet })
    fakeWallet.synced = true
    setPeachWallet(fakeWallet)
    const { result } = renderHook(() => useSyncWallet())

    expect(result.current.refreshing).toBe(false)
  })

  it('should initialize with refreshing set to true if wallet is not synced', () => {
    const fakeWallet = new PeachWallet({ wallet })
    fakeWallet.synced = false
    setPeachWallet(fakeWallet)

    const { result } = renderHook(() => useSyncWallet())

    expect(result.current.refreshing).toBe(true)
  })

  it('should call peachWallet.syncWallet on refresh', async () => {
    const fakeWallet = new PeachWallet({ wallet })
    fakeWallet.synced = true
    fakeWallet.syncWallet = jest.fn()
    setPeachWallet(fakeWallet)
    const { result } = renderHook(() => useSyncWallet())

    await act(async () => {
      await result.current.refresh()
    })

    expect(fakeWallet.syncWallet).toHaveBeenCalled()
  })

  it('should set refreshing to false after refresh', async () => {
    const fakeWallet = new PeachWallet({ wallet })
    fakeWallet.synced = true
    setPeachWallet(fakeWallet)
    const { result } = renderHook(() => useSyncWallet())

    await act(async () => {
      await result.current.refresh()
    })

    expect(result.current.refreshing).toBe(false)
  })

  it('should not call peachWallet.syncWallet if already refreshing', async () => {
    const fakeWallet = new PeachWallet({ wallet })
    fakeWallet.synced = false
    fakeWallet.syncWallet = jest.fn()
    setPeachWallet(fakeWallet)
    const { result } = renderHook(() => useSyncWallet())

    await act(async () => {
      await result.current.refresh()
    })

    expect(fakeWallet.syncWallet).not.toHaveBeenCalled()
  })
})
