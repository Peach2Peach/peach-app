import { fireEvent, render, renderHook, waitFor } from '@testing-library/react-native'
import { NavigationWrapper, headerState, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { WithdrawingFundsHelp } from '../../../popups/info/WithdrawingFundsHelp'
import { usePopupStore } from '../../../store/usePopupStore'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useWalletSetup } from './useWalletSetup'
import { useSettingsStore } from '../../../store/settingsStore'
import { act } from 'react-test-renderer'

describe('useWalletSetup', () => {
  const wrapper = NavigationWrapper
  const initialProps = { syncOnLoad: true }
  const balance = 21000000

  // @ts-ignore
  const peachWallet = new PeachWallet()

  beforeAll(() => {
    useWalletState.getState().setBalance(balance)
    setPeachWallet(peachWallet)
  })
  it('should return correct default values', async () => {
    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })

    expect(result.current.balance).toEqual(balance)
    expect(result.current.refresh).toBeInstanceOf(Function)
    expect(result.current.isRefreshing).toBeFalsy()
    expect(result.current.address).toBe('')
    expect(result.current.setAddress).toBeInstanceOf(Function)
    expect(result.current.addressErrors).toHaveLength(0)
    expect(result.current.canWithdrawAll).toBeFalsy()
    expect(result.current.walletLoading).toBeTruthy()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should return true for canWithdrawAll if peach wallet has a balance and address is set', () => {
    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })
    act(() => result.current.setAddress('bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh'))
    expect(result.current.canWithdrawAll).toBeTruthy()
  })
  it('should return false for canWithdrawAll if peach wallet has no balance', () => {
    useWalletState.getState().setBalance(0)
    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })
    act(() => result.current.setAddress('bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh'))
    expect(result.current.canWithdrawAll).toBeFalsy()
  })
  it('should sync wallet on load', async () => {
    peachWallet.syncWallet = jest.fn()
    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })

    expect(result.current.walletLoading).toBeTruthy()
    expect(peachWallet.syncWallet).toHaveBeenCalled()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should set up the header correctly while loading', async () => {
    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })
    expect(headerState.header()).toMatchSnapshot()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should set up the header correctly when loaded', async () => {
    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
    expect(headerState.header()).toMatchSnapshot()

    const { getByAccessibilityHint } = render(headerState.header(), { wrapper })
    fireEvent(getByAccessibilityHint('go to transaction history'), 'onPress')
    expect(navigateMock).toHaveBeenCalledWith('transactionHistory')
    fireEvent(getByAccessibilityHint('go to network fees'), 'onPress')
    expect(navigateMock).toHaveBeenCalledWith('networkFees')
    fireEvent(getByAccessibilityHint('help'), 'onPress')
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'sending funds',
      content: <WithdrawingFundsHelp />,
    })
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
