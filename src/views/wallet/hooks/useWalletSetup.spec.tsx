import { act, renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { settingsStore } from '../../../store/settingsStore'
import { useWalletSetup } from './useWalletSetup'
import { usePopupStore } from '../../../store/usePopupStore'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'

const walletStore = {}
const walletStateMock = jest.fn((selector, _compareFn) => selector(walletStore))
jest.mock('../../../utils/wallet/walletStore', () => ({
  useWalletState: (selector: any, compareFn: any) => walletStateMock(selector, compareFn),
}))
const mockWithdrawAll = jest.fn().mockResolvedValue({
  txDetails: {
    txId: 'txId',
  },
})
jest.mock('../../../utils/wallet/setWallet', () => ({
  peachWallet: {
    transactions: [],
    withdrawAll: (...args: any) => mockWithdrawAll(...args),
    syncWallet: jest.fn().mockResolvedValue(undefined),
  },
}))

describe('useWalletSetup', () => {
  const wrapper = NavigationWrapper
  const address = 'bitcoinAddress'
  it('should return correct default values', async () => {
    const { result } = renderHook(useWalletSetup, { wrapper })

    expect(result.current.walletStore).toEqual(walletStore)
    expect(result.current.refresh).toBeInstanceOf(Function)
    expect(result.current.isRefreshing).toBeFalsy()
    expect(result.current.isValid).toBeTruthy()
    expect(result.current.address).toBe('')
    expect(result.current.setAddress).toBeInstanceOf(Function)
    expect(result.current.addressErrors).toHaveLength(0)
    expect(result.current.openWithdrawalConfirmation).toBeInstanceOf(Function)
    expect(result.current.confirmWithdrawal).toBeInstanceOf(Function)
    expect(result.current.walletLoading).toBeTruthy()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })

  it('should open confirm withdrawal popup', async () => {
    const { result } = renderHook(useWalletSetup, { wrapper })

    act(() => {
      result.current.openWithdrawalConfirmation()
    })

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'sending funds',
      content: <WithdrawalConfirmation />,
      visible: true,
      action2: {
        callback: expect.any(Function),
        label: 'cancel',
        icon: 'xCircle',
      },
      action1: {
        callback: expect.any(Function),
        label: 'confirm & send',
        icon: 'arrowRightCircle',
      },
      level: 'APP',
    })
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should confirm withdrawal with correct fees', async () => {
    const finalFeeRate = 3
    settingsStore.getState().setFeeRate(finalFeeRate)
    const { result } = renderHook(useWalletSetup, { wrapper })

    act(() => {
      result.current.setAddress(address)
    })
    act(() => {
      result.current.openWithdrawalConfirmation()
    })
    await act(() => {
      usePopupStore.getState().action1?.callback()
    })

    expect(mockWithdrawAll).toHaveBeenCalledWith(address, finalFeeRate)
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
})
