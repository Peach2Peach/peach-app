import { renderHook } from '@testing-library/react-native'
import { Linking } from 'react-native'
import {
  bitcoinTransaction,
  confirmedTransactionSummary,
  pending1,
  pendingTransactionSummary,
} from '../../../../tests/unit/data/transactionDetailData'
import { NavigationWrapper, navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useTransactionDetailsInfoSetup } from './useTransactionDetailsInfoSetup'

const useTransactionDetailsMock = jest.fn().mockReturnValue({
  transaction: bitcoinTransaction,
})
jest.mock('../../../hooks/query/useTransactionDetails', () => ({
  useTransactionDetails: (...args: any[]) => useTransactionDetailsMock(...args),
}))

const wrapper = NavigationWrapper

describe('useTransactionDetailsInfoSetup', () => {
  const initialProps = {
    transaction: pendingTransactionSummary,
  }
  // @ts-ignore
  const peachWallet = new PeachWallet()

  beforeAll(() => {
    useWalletState.getState().setTransactions([pending1])
    peachWallet.transactions = [pending1]

    setPeachWallet(peachWallet)
  })

  it('should return defaults', () => {
    const { result } = renderHook(useTransactionDetailsInfoSetup, { wrapper, initialProps })
    expect(result.current).toEqual({
      receivingAddress: 'bc1p0w3vredacted',
      canBumpFees: true,
      goToBumpNetworkFees: expect.any(Function),
      openInExplorer: expect.any(Function),
    })
    expect(useTransactionDetailsMock).toHaveBeenCalledWith({ txId: pending1.txid })
  })
  it('should set canBumpFees to false if tx is confirmed', () => {
    const { result } = renderHook(useTransactionDetailsInfoSetup, {
      wrapper,
      initialProps: {
        transaction: confirmedTransactionSummary,
      },
    })
    expect(result.current.canBumpFees).toBeFalsy()
  })
  it('should go to bump network fees', () => {
    const { result } = renderHook(useTransactionDetailsInfoSetup, { wrapper, initialProps })
    result.current.goToBumpNetworkFees()
    expect(navigateMock).toHaveBeenCalledWith('bumpNetworkFees', { txId: pending1.txid })
  })
  it('should open transaction in explorer', () => {
    const openURL = jest.spyOn(Linking, 'openURL')

    const { result } = renderHook(useTransactionDetailsInfoSetup, { wrapper, initialProps })
    result.current.openInExplorer()
    expect(openURL).toHaveBeenCalledWith('https://localhost:3000/tx/txid1')
  })
})
