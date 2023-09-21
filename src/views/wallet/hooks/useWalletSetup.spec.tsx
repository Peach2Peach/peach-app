import { renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useSettingsStore } from '../../../store/settingsStore'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useWalletSetup } from './useWalletSetup'

const refreshMock = jest.fn()
const useSyncWalletMock = jest.fn().mockReturnValue({ refresh: refreshMock })
jest.mock('./useSyncWallet', () => ({
  useSyncWallet: () => useSyncWalletMock(),
}))
jest.useFakeTimers()

const wrapper = NavigationWrapper

// @ts-expect-error Mock doesn't need arguments
const peachWallet = new PeachWallet()
peachWallet.initialized = true
const initialProps = { peachWallet, syncOnLoad: true }

const balance = 21000000
const setupWalletTests = () => () => {
  useWalletState.getState().setBalance(balance)
  peachWallet.initialized = true
}

describe('useWalletSetup', () => {
  beforeAll(setupWalletTests())
  it('should return correct default values', async () => {
    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })

    expect(result.current.balance).toEqual(balance)
    expect(result.current.refresh).toEqual(refreshMock)
    expect(result.current.isRefreshing).toBeFalsy()
    expect(result.current.walletLoading).toBeTruthy()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should sync wallet on load', async () => {
    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })

    expect(result.current.walletLoading).toBeTruthy()
    expect(refreshMock).toHaveBeenCalled()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should retry sync wallet on load if peach wallet is not ready yet', async () => {
    peachWallet.initialized = false

    const { rerender } = renderHook(useWalletSetup, { wrapper, initialProps })
    expect(refreshMock).not.toHaveBeenCalled()
    peachWallet.initialized = true
    rerender(initialProps)

    await waitFor(() => expect(refreshMock).toHaveBeenCalled())
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
