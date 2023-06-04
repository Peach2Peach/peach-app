import { act, renderHook } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { settingsStore } from '../../../store/settingsStore'
import { useWalletSetup } from './useWalletSetup'

const walletStore = {}
const walletStateMock = jest.fn((selector, _compareFn) => selector(walletStore))
jest.mock('../../../utils/wallet/walletStore', () => ({
  useWalletState: (selector: any, compareFn: any) => walletStateMock(selector, compareFn),
}))
const mockWithdrawAll = jest.fn()
jest.mock('../../../utils/wallet/setWallet', () => ({
  peachWallet: {
    withdrawAll: (...args: any) => mockWithdrawAll(...args),
    allTransactions: [],
    syncWallet: jest.fn((onSuccess: () => void) => onSuccess()),
  },
}))

describe('useWalletSetup', () => {
  const address = 'bitcoinAddress'
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should return correct default values', () => {
    const { result } = renderHook(useWalletSetup, { wrapper: NavigationWrapper })

    expect(result.current.walletStore).toEqual(walletStore)
    expect(result.current.refresh).toBeInstanceOf(Function)
    expect(result.current.isRefreshing).toBeFalsy()
    expect(result.current.onChange).toBeInstanceOf(Function)
    expect(result.current.isValid).toBeTruthy()
    expect(result.current.address).toBe('')
    expect(result.current.addressErrors).toHaveLength(0)
    expect(result.current.openWithdrawalConfirmation).toBeInstanceOf(Function)
    expect(result.current.confirmWithdrawal).toBeInstanceOf(Function)
    expect(result.current.walletLoading).toBeFalsy()
  })

  it('should confirm withdrawal with correct fees', () => {
    const finalFeeRate = 3
    settingsStore.getState().setFeeRate(finalFeeRate)
    const { result } = renderHook(useWalletSetup, { wrapper: NavigationWrapper })

    act(() => {
      result.current.setAddress(address)
    })
    act(() => {
      result.current.confirmWithdrawal()
    })

    expect(mockWithdrawAll).toHaveBeenCalledWith(address, finalFeeRate)
  })
})
