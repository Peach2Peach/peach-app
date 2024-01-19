import { render, renderHook, waitFor } from 'test-utils'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { queryClient } from '../../../../tests/unit/helpers/QueryClientWrapper'
import { createTestWallet } from '../../../../tests/unit/helpers/createTestWallet'
import { Overlay } from '../../../Overlay'
import { useSessionStore } from '../../../store/sessionStore'
import { useSettingsStore } from '../../../store/settingsStore/useSettingsStore'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useWalletSetup } from './useWalletSetup'

jest.useFakeTimers()

const balance = 21000000
describe('useWalletSetup', () => {
  beforeAll(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }))
    useWalletState.getState().setBalance(balance)
    peachWallet.initialized = true
  })
  beforeEach(() => {
    useSessionStore.getState().reset()
  })
  afterEach(() => {
    queryClient.clear()
  })
  const initialProps = { syncOnLoad: true }
  it('should return correct default values', async () => {
    const { result } = renderHook(useWalletSetup, { initialProps })

    expect(result.current.balance).toEqual(balance)
    expect(result.current.refresh).toEqual(expect.any(Function))
    expect(result.current.isRefreshing).toBeTruthy()
    expect(result.current.walletLoading).toBeTruthy()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should sync wallet once on load', async () => {
    const { result, rerender } = renderHook(useWalletSetup, { initialProps })

    expect(result.current.walletLoading).toBeTruthy()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
    await waitFor(() => expect(peachWallet.syncWallet).toHaveBeenCalledTimes(1))

    rerender(initialProps)
    expect(peachWallet.syncWallet).toHaveBeenCalledTimes(1)
  })
  it('should retry sync wallet on load if peach wallet is not ready yet', async () => {
    peachWallet.initialized = false

    const { rerender } = renderHook(useWalletSetup, { initialProps })
    expect(peachWallet.syncWallet).not.toHaveBeenCalled()
    peachWallet.initialized = true
    rerender(initialProps)

    await waitFor(() => expect(peachWallet.syncWallet).toHaveBeenCalled())
  })
  it('should navigate to backupTime if balance is bigger than 0 & showBackupReminder is false', async () => {
    useWalletState.getState().setBalance(1)
    useSettingsStore.setState({
      showBackupReminder: false,
      shouldShowBackupOverlay: true,
    })
    const { result } = renderHook(useWalletSetup, { initialProps })

    const { getByText } = render(<Overlay />)
    expect(getByText('backup time!')).toBeTruthy()
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
