import { act, renderHook } from '@testing-library/react-native'
import { broadcastError } from '../../../../tests/unit/data/errors'
import { bitcoinTransaction, pending1 } from '../../../../tests/unit/data/transactionDetailData'
import { NavigationWrapper, goBackMock, headerState } from '../../../../tests/unit/helpers/NavigationWrapper'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { Loading } from '../../../components'
import { placeholderFees } from '../../../hooks/query/useFeeEstimate'
import { usePopupStore } from '../../../store/usePopupStore'
import tw from '../../../styles/tailwind'
import { getTransactionFeeRate } from '../../../utils/bitcoin'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { walletStore } from '../../../utils/wallet/walletStore'
import { ConfirmRbf } from '../components/ConfirmRbf'
import { useBumpNetworkFeesSetup } from './useBumpNetworkFeesSetup'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'

const useRouteMock = jest.fn(() => ({
  params: { txId: bitcoinTransaction.txid },
}))
jest.mock('../../../hooks/useRoute', () => ({
  useRoute: () => useRouteMock(),
}))

const useTransactionDetailsMock = jest.fn().mockReturnValue({
  transaction: bitcoinTransaction,
})
jest.mock('../../../hooks/query/useTransactionDetails', () => ({
  useTransactionDetails: (...args: any[]) => useTransactionDetailsMock(...args),
}))

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner:
    () =>
      (...args: any[]) =>
        showErrorBannerMock(...args),
}))

const wrapper = NavigationWrapper
describe('useBumpNetworkFeesSetup', () => {
  const currentFeeRate = getTransactionFeeRate(bitcoinTransaction)
  const newFeeRate = 10

  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })

  it('should return defaults', () => {
    const { result } = renderHook(useBumpNetworkFeesSetup, { wrapper })
    expect(result.current).toEqual({
      transaction: bitcoinTransaction,
      currentFeeRate,
      newFeeRate: undefined,
      setNewFeeRate: expect.any(Function),
      newFeeRateIsValid: false,
      newFeeRateErrors: [],
      estimatedFees: placeholderFees,
      overpayingBy: 0,
      bumpFees: expect.any(Function),
    })
    expect(useTransactionDetailsMock).toHaveBeenCalledWith({ txId: bitcoinTransaction.txid })
  })
  it('should set up header correctly', () => {
    renderHook(useBumpNetworkFeesSetup, { wrapper })
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should set new fee', () => {
    const { result } = renderHook(useBumpNetworkFeesSetup, { wrapper })

    act(() => result.current.setNewFeeRate(String(newFeeRate)))

    expect(result.current.newFeeRate).toBe(newFeeRate)
    expect(result.current.newFeeRateIsValid).toBeTruthy()
    expect(result.current.newFeeRateErrors).toHaveLength(0)
  })
  it('should return error if new fee is equal or below current fee', () => {
    const { result } = renderHook(useBumpNetworkFeesSetup, { wrapper })
    act(() => result.current.setNewFeeRate('1'))

    expect(result.current.newFeeRate).toBe('1')
    expect(result.current.newFeeRateIsValid).toBeFalsy()
    expect(result.current.newFeeRateErrors).toEqual(['value is below minimum'])

    act(() => result.current.setNewFeeRate(String(currentFeeRate)))
    expect(result.current.newFeeRate).toBe(currentFeeRate)
    expect(result.current.newFeeRateIsValid).toBeFalsy()
    expect(result.current.newFeeRateErrors).toEqual(['value is below minimum'])
  })
  it('should return how much user is overpaying by', () => {
    const { result } = renderHook(useBumpNetworkFeesSetup, { wrapper })

    act(() => result.current.setNewFeeRate(String(placeholderFees.fastestFee * 2)))
    expect(result.current.overpayingBy).toBe(1)
    act(() => result.current.setNewFeeRate(String(placeholderFees.fastestFee * 3)))
    expect(result.current.overpayingBy).toBe(2)
  })
  it('should show bump fee confirmation popup', async () => {
    walletStore.getState().setTransactions([{ ...pending1, sent: 100000, received: 20000 }])
    const { result } = renderHook(useBumpNetworkFeesSetup, { wrapper })

    act(() => result.current.setNewFeeRate(String(newFeeRate)))
    await result.current.bumpFees()

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'increasing fees',
      level: 'APP',
      content: (
        <ConfirmRbf
          oldFeeRate={currentFeeRate}
          newFeeRate={newFeeRate}
          bytes={bitcoinTransaction.size}
          sendingAmount={80000}
        />
      ),
      action1: {
        label: 'confirm & send',
        icon: 'arrowRightCircle',
        callback: expect.any(Function),
      },
      action2: {
        label: 'cancel',
        icon: 'xCircle',
        callback: usePopupStore.getState().closePopup,
      },
    })
  })

  it('should broadcast bump fee transaction', async () => {
    const txDetails = getTransactionDetails(bitcoinTransaction.value, newFeeRate)
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(txDetails)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(txDetails.psbt)

    const { result } = renderHook(useBumpNetworkFeesSetup, { wrapper })

    await result.current.bumpFees()
    const promise = usePopupStore.getState().action1?.callback()

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'increasing fees',
      level: 'APP',
      content: <Loading color={tw`text-black-1`.color} style={tw`self-center`} />,
      action1: {
        label: 'loading...',
        icon: 'clock',
        callback: expect.any(Function),
      },
    })

    await promise

    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(txDetails.psbt)
    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(goBackMock).toHaveBeenCalled()
  })
  it('should handle broadcast errors', async () => {
    peachWallet.signAndBroadcastPSBT = jest.fn().mockImplementation(() => {
      throw broadcastError
    })

    const { result } = renderHook(useBumpNetworkFeesSetup, { wrapper })

    await result.current.bumpFees()
    await usePopupStore.getState().action1?.callback()
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
    expect(usePopupStore.getState().visible).toBeFalsy()
  })
})
