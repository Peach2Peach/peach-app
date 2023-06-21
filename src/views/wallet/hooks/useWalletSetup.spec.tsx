import { act, fireEvent, render, renderHook, waitFor } from '@testing-library/react-native'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { transactionError } from '../../../../tests/unit/data/errors'
import { NavigationWrapper, headerState, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'
import { WithdrawingFundsHelp } from '../../../popups/info/WithdrawingFundsHelp'
import { usePopupStore } from '../../../store/usePopupStore'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useWalletSetup } from './useWalletSetup'

const useFeeEstimateMock = jest.fn().mockReturnValue({ estimatedFees })
jest.mock('../../../hooks/query/useFeeEstimate', () => ({
  useFeeEstimate: () => useFeeEstimateMock(),
}))

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner:
    () =>
      (...args: any[]) =>
        showErrorBannerMock(...args),
}))

describe('useWalletSetup', () => {
  const wrapper = NavigationWrapper
  const initialProps = { syncOnLoad: true }
  const address = 'bitcoinAddress'
  const balance = 21000000
  const feeRate = estimatedFees.halfHourFee
  const fee = feeRate * 110
  const transaction = getTransactionDetails(balance, feeRate)

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
    expect(result.current.openWithdrawalConfirmation).toBeInstanceOf(Function)
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
  it('should set up the header correctly while loading', async () => {
    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })
    expect(headerState.header()).toMatchSnapshot()
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should set up the header correctly when loaded', async () => {
    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
    expect(headerState.header()).toMatchSnapshot()

    const { getByAccessibilityHint } = render(headerState.header(), { wrapper, initialProps })
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
  it('should open confirm withdrawal popup', async () => {
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(transaction)

    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })

    act(() => {
      result.current.setAddress(address)
    })
    await act(async () => {
      await result.current.openWithdrawalConfirmation()
    })

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'sending funds',
      content: <WithdrawalConfirmation {...{ address, amount: balance, fee, feeRate }} />,
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
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(transaction)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(transaction.psbt)

    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })

    act(() => {
      result.current.setAddress(address)
    })
    await act(async () => {
      await result.current.openWithdrawalConfirmation()
    })
    await act(() => {
      usePopupStore.getState().action1?.callback()
    })

    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(transaction.psbt)
    expect(result.current.address).toBe('')
    await waitFor(() => expect(result.current.walletLoading).toBeFalsy())
  })
  it('should handle transaction errors', async () => {
    peachWallet.finishTransaction = jest.fn().mockImplementation(() => {
      throw transactionError
    })

    const { result } = renderHook(useWalletSetup, { wrapper, initialProps })

    await act(async () => {
      await result.current.openWithdrawalConfirmation()
    })
    await usePopupStore.getState().action1?.callback()
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
    expect(usePopupStore.getState().visible).toBeFalsy()
  })
})
