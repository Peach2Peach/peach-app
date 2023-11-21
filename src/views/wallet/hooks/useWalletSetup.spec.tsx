import { renderHook, waitFor } from 'test-utils'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useSessionStore } from '../../../store/sessionStore'
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

// @ts-expect-error mock doesn't need args
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
  beforeEach(() => {
    useSessionStore.getState().reset()
  })
  it('should return correct default values', async () => {
    const { result } = renderHook(useWalletSetup, { initialProps })

    expect(result.current.balance).toEqual(balance)
    expect(result.current.refresh).toEqual(refreshMock)
    expect(result.current.isRefreshing).toBeFalsy()
    expect(result.current.walletLoading).toBeTruthy()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should sync wallet once on load', async () => {
    const { result, rerender } = renderHook(useWalletSetup, { initialProps })

    expect(result.current.walletLoading).toBeTruthy()
    expect(refreshMock).toHaveBeenCalled()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())

    rerender(initialProps)
    expect(refreshMock).toHaveBeenCalledTimes(1)
  })
  it('should retry sync wallet on load if peach wallet is not ready yet', async () => {
    peachWallet.initialized = false

    const { rerender } = renderHook(useWalletSetup, { initialProps })
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
    const { result } = renderHook(useWalletSetup, { initialProps })

    expect(navigateMock).toHaveBeenCalledWith('backupTime', { nextScreen: 'wallet' })
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should not navigate to backupTime if balance is bigger than 0 & showBackupReminder is already true', async () => {
    useWalletState.getState().setBalance(1)
    useSettingsStore.setState({
      showBackupReminder: true,
      shouldShowBackupOverlay: true,
    })
    const { result } = renderHook(useWalletSetup, { initialProps })

    expect(navigateMock).not.toHaveBeenCalled()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
})
