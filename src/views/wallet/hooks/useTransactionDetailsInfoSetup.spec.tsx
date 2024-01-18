import { Linking } from 'react-native'
import { renderHook } from 'test-utils'
import {
  confirmedTransactionSummary,
  pending1,
  pendingTransactionSummary,
  transactionWithRBF1,
  transactionWithoutRBF1,
} from '../../../../tests/unit/data/transactionDetailData'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useTransactionDetailsInfoSetup } from './useTransactionDetailsInfoSetup'

const myAddress = 'bc1qtevf8qxjr2f3ku982l324rstmknffvwavecsdt'
const notMyAddress = '1B5BPUZGErrCzDPPWc7Hs6vyHW81CmVpdN'
const vout = [{ scriptpubkey_address: myAddress }, { scriptpubkey_address: notMyAddress }] as Transaction['vout']

const useAreMyAddressesMock = jest.fn().mockReturnValue([true, false])
jest.mock('../../../hooks/wallet/useIsMyAddress', () => ({
  useAreMyAddresses: (...args: string[]) => useAreMyAddressesMock(...args),
}))

const useTransactionDetailsMock = jest.fn().mockReturnValue({
  transaction: { ...transactionWithRBF1, vout },
})
jest.mock('../../../hooks/query/useTransactionDetails', () => ({
  useTransactionDetails: (...args: unknown[]) => useTransactionDetailsMock(...args),
}))

describe('useTransactionDetailsInfoSetup', () => {
  const initialProps = {
    transaction: pendingTransactionSummary,
  }
  // @ts-expect-error mock doesn't need args
  const peachWallet = new PeachWallet({})

  beforeAll(() => {
    useWalletState.getState().setTransactions([pending1])
    peachWallet.transactions = [pending1]

    setPeachWallet(peachWallet)
  })

  it('should return defaults', () => {
    const { result } = renderHook(useTransactionDetailsInfoSetup, { initialProps })
    expect(result.current).toEqual({
      receivingAddress: myAddress,
      canBumpFees: true,
      goToBumpNetworkFees: expect.any(Function),
      openInExplorer: expect.any(Function),
    })
    expect(useTransactionDetailsMock).toHaveBeenCalledWith({ txId: pending1.txid })
  })
  it('should set canBumpFees to false if tx is confirmed', () => {
    const { result } = renderHook(useTransactionDetailsInfoSetup, {
      initialProps: {
        transaction: confirmedTransactionSummary,
      },
    })
    expect(result.current.canBumpFees).toBeFalsy()
  })
  it('should set canBumpFees to false if tx does not support rbf', () => {
    useTransactionDetailsMock.mockReturnValueOnce({
      transaction: transactionWithoutRBF1,
    })
    const { result } = renderHook(useTransactionDetailsInfoSetup, {
      initialProps: {
        transaction: { ...pendingTransactionSummary, id: transactionWithoutRBF1.txid },
      },
    })
    expect(result.current.canBumpFees).toBeFalsy()
  })
  it('should go to bump network fees', () => {
    const { result } = renderHook(useTransactionDetailsInfoSetup, { initialProps })
    result.current.goToBumpNetworkFees()
    expect(navigateMock).toHaveBeenCalledWith('bumpNetworkFees', { txId: pending1.txid })
  })
  it('should open transaction in explorer', async () => {
    const openURL = jest.spyOn(Linking, 'openURL')

    const { result } = renderHook(useTransactionDetailsInfoSetup, { initialProps })
    await result.current.openInExplorer()
    expect(openURL).toHaveBeenCalledWith('https://localhost:3000/tx/txid1')
  })
})
