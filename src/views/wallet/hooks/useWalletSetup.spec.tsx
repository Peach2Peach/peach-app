import { act, renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useSettingsStore } from '../../../store/settingsStore'
import { useWalletSetup } from './useWalletSetup'
import { usePopupStore } from '../../../store/usePopupStore'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { useWalletState } from '../../../utils/wallet/walletStore'

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

const useFeeEstimateMock = jest.fn().mockReturnValue({ estimatedFees })
jest.mock('../../../hooks/query/useFeeEstimate', () => ({
  useFeeEstimate: () => useFeeEstimateMock(),
}))

describe('useWalletSetup', () => {
  const wrapper = NavigationWrapper
  const address = 'bitcoinAddress'
  it('should return correct default values', async () => {
    const { result } = renderHook(useWalletSetup, { wrapper })

    expect(result.current.walletStore).toEqual(useWalletState.getState())
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
    useSettingsStore.getState().setFeeRate(finalFeeRate)
    const { result } = renderHook(useWalletSetup, { wrapper })

    act(() => {
      result.current.setAddress(address)
    })
    act(() => {
      result.current.openWithdrawalConfirmation()
    })
    await act(async () => {
      await usePopupStore.getState().action1?.callback()
    })

    expect(mockWithdrawAll).toHaveBeenCalledWith(address, finalFeeRate)
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should navigate to backupTime if balance is bigger than 0 & showBackupReminder is false', async () => {
    useWalletState.getState().setBalance(1)
    useSettingsStore.setState({
      showBackupReminder: false,
      shouldShowBackupOverlay: true,
    })
    const { result } = renderHook(useWalletSetup, { wrapper })

    expect(navigateMock).toHaveBeenCalledWith('backupTime', { nextScreen: 'wallet' })
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should not navigate to backupTime if balance is bigger than 0 & showBackupReminder is already true', async () => {
    useWalletState.getState().setBalance(1)
    useSettingsStore.setState({
      showBackupReminder: true,
      shouldShowBackupOverlay: true,
    })
    const { result } = renderHook(useWalletSetup, { wrapper })

    expect(navigateMock).not.toHaveBeenCalled()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
})
