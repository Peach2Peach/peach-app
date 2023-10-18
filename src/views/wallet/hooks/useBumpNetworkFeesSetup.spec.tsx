import { act, renderHook, waitFor } from 'test-utils'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { bitcoinTransaction, pending1 } from '../../../../tests/unit/data/transactionDetailData'
import { headerState } from '../../../../tests/unit/helpers/NavigationWrapper'
import { getTransactionFeeRate } from '../../../utils/bitcoin'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useBumpNetworkFeesSetup } from './useBumpNetworkFeesSetup'

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
  useTransactionDetails: (...args: unknown[]) => useTransactionDetailsMock(...args),
}))

const useFeeEstimateMock = jest.fn().mockReturnValue({ estimatedFees })
jest.mock('../../../hooks/query/useFeeEstimate', () => ({
  useFeeEstimate: () => useFeeEstimateMock(),
}))

describe('useBumpNetworkFeesSetup', () => {
  const currentFeeRate = getTransactionFeeRate(bitcoinTransaction)
  const newFeeRate = 10

  beforeAll(() => {
    useWalletState
      .getState()
      .setTransactions([{ ...pending1, txid: bitcoinTransaction.txid, sent: 100000, received: 20000 }])
  })
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })

  it('should return defaults', () => {
    const { result } = renderHook(useBumpNetworkFeesSetup)
    expect(result.current).toEqual({
      transaction: bitcoinTransaction,
      currentFeeRate,
      newFeeRate: '2.32',
      setNewFeeRate: expect.any(Function),
      newFeeRateIsValid: true,
      newFeeRateErrors: [],
      estimatedFees,
      sendingAmount: 80000,
      overpayingBy: -0.8895238095238095,
    })
    expect(useTransactionDetailsMock).toHaveBeenCalledWith({ txId: bitcoinTransaction.txid })
  })
  it('should update new fee rate value when transaction has loaded', async () => {
    useTransactionDetailsMock.mockReturnValue({ transaction: undefined })
    const { result, rerender } = renderHook(useBumpNetworkFeesSetup)
    expect(result.current.newFeeRate).toBe('2.01')
    useTransactionDetailsMock.mockReturnValue({ transaction: bitcoinTransaction })
    rerender({})
    await waitFor(() => expect(result.current.newFeeRate).toBe('2.32'))
  })
  it('should show no header while loading', () => {
    useTransactionDetailsMock.mockReturnValue({ transaction: undefined })
    renderHook(useBumpNetworkFeesSetup)
    useTransactionDetailsMock.mockReturnValue({ transaction: bitcoinTransaction })

    expect(headerState.header()).toMatchSnapshot()
  })
  it('should set up header correctly', () => {
    renderHook(useBumpNetworkFeesSetup)
    expect(headerState.header()).toMatchSnapshot()
  })
  it('should set new fee', () => {
    const { result } = renderHook(useBumpNetworkFeesSetup)

    act(() => result.current.setNewFeeRate(String(newFeeRate)))

    expect(result.current.newFeeRate).toBe(String(newFeeRate))
    expect(result.current.newFeeRateIsValid).toBeTruthy()
    expect(result.current.newFeeRateErrors).toHaveLength(0)
  })
  it('should return error if new fee is equal or below current fee', () => {
    const { result } = renderHook(useBumpNetworkFeesSetup)
    act(() => result.current.setNewFeeRate('1'))

    expect(result.current.newFeeRate).toBe('1')
    expect(result.current.newFeeRateIsValid).toBeFalsy()
    expect(result.current.newFeeRateErrors).toEqual(['value is below minimum'])

    act(() => result.current.setNewFeeRate(String(currentFeeRate)))
    expect(result.current.newFeeRate).toBe(String(currentFeeRate))
    expect(result.current.newFeeRateIsValid).toBeFalsy()
    expect(result.current.newFeeRateErrors).toEqual(['value is below minimum'])
  })
  it('should return how much user is overpaying by', () => {
    const { result } = renderHook(useBumpNetworkFeesSetup)

    act(() => result.current.setNewFeeRate(String(estimatedFees.fastestFee * 2)))
    expect(result.current.overpayingBy).toBe(1)
    act(() => result.current.setNewFeeRate(String(estimatedFees.fastestFee * 3)))
    expect(result.current.overpayingBy).toBe(2)
  })
})
