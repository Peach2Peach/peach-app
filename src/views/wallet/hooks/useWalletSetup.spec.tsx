import { act, renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useSettingsStore } from '../../../store/settingsStore'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useWalletSetup } from './useWalletSetup'

jest.useFakeTimers()

const wrapper = NavigationWrapper
const initialProps = true
const balance = 21000000
const setupWalletTests = (peachWallet: PeachWallet) => () => {
  useWalletState.getState().setBalance(balance)
  setPeachWallet(peachWallet)
}

describe('useWalletSetup', () => {
  // @ts-ignore
  const peachWallet = new PeachWallet()
  peachWallet.initialized = true

  beforeAll(setupWalletTests(peachWallet))
  it('should return correct default values', async () => {
    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })

    expect(result.current.balance).toEqual(balance)
    expect(result.current.refresh).toBeInstanceOf(Function)
    expect(result.current.isRefreshing).toBeFalsy()
    expect(result.current.walletLoading).toBeTruthy()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should sync wallet on load', async () => {
    peachWallet.syncWallet = jest.fn()
    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })

    expect(result.current.walletLoading).toBeTruthy()
    expect(peachWallet.syncWallet).toHaveBeenCalled()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should retry sync wallet on load if peach wallet is not ready yet', async () => {
    peachWallet.syncWallet = jest.fn()
    peachWallet.initialized = false
    renderHook(useWalletSetup, { wrapper, initialProps })
    expect(peachWallet.syncWallet).not.toHaveBeenCalled()
    peachWallet.initialized = true
    act(() => {
      jest.advanceTimersByTime(1001)
    })
    await waitFor(() => expect(peachWallet.syncWallet).toHaveBeenCalled())
  })
  it('should navigate to backupTime if balance is bigger than 0 & showBackupReminder is false', async () => {
    useWalletState.getState().setBalance(1)
    useSettingsStore.setState({
      showBackupReminder: false,
      shouldShowBackupOverlay: true,
    })
    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })

    expect(navigateMock).toHaveBeenCalledWith('backupTime', { nextScreen: 'wallet' })
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should not navigate to backupTime if balance is bigger than 0 & showBackupReminder is already true', async () => {
    useWalletState.getState().setBalance(1)
    useSettingsStore.setState({
      showBackupReminder: true,
      shouldShowBackupOverlay: true,
    })
    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })

    expect(navigateMock).not.toHaveBeenCalled()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
})
