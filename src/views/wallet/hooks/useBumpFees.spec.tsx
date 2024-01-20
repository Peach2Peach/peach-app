import { fireEvent, render, renderHook, waitFor } from 'test-utils'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { transactionError } from '../../../../tests/unit/data/errors'
import {
  bdkTransactionWithRBF1,
  bitcoinJSTransactionWithRBF1,
  pending1,
} from '../../../../tests/unit/data/transactionDetailData'
import { goBackMock, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { createTestWallet } from '../../../../tests/unit/helpers/createTestWallet'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { Popup } from '../../../components/popup/Popup'
import i18n from '../../../utils/i18n'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useBumpFees } from './useBumpFees'

const useFeeEstimateMock = jest.fn().mockReturnValue({ estimatedFees })
jest.mock('../../../hooks/query/useFeeEstimate', () => ({
  useFeeEstimate: () => useFeeEstimateMock(),
}))

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))
jest.useFakeTimers()

describe('useBumpFees', () => {
  const currentFeeRate = 9
  const newFeeRate = 10
  const initialProps = {
    transaction: bitcoinJSTransactionWithRBF1,
    currentFeeRate,
    newFeeRate,
    sendingAmount: bdkTransactionWithRBF1.sent,
  }
  const peachWallet = new PeachWallet({ wallet: createTestWallet() })

  const newTxId = 'newTxId'
  const txDetails = getTransactionDetails(bdkTransactionWithRBF1.sent, newFeeRate, 'newTxId')

  beforeEach(() => {
    const transactions = [{ ...pending1, txid: bitcoinJSTransactionWithRBF1.getId(), sent: 100000, received: 20000 }]
    peachWallet.transactions = transactions
    setPeachWallet(peachWallet)
    useWalletState.getState().setTransactions(peachWallet.transactions)
  })

  it('should not show bump fee confirmation popup if transaction details could not be loaded', async () => {
    const { result } = renderHook(useBumpFees, { initialProps: { ...initialProps, transaction: undefined } })

    await result.current()

    const { queryByText } = render(<Popup />)
    expect(queryByText(i18n('wallet.bumpNetworkFees.confirmRbf.title'))).toBeFalsy()
  })
  it('should show bump fee confirmation popup', async () => {
    const { result } = renderHook(useBumpFees, { initialProps })

    await result.current()

    const { queryByText } = render(<Popup />)
    expect(queryByText(i18n('wallet.bumpNetworkFees.confirmRbf.title'))).toBeTruthy()
  })

  it('should broadcast bump fee transaction', async () => {
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(txDetails.psbt)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(txDetails.psbt)

    const { result } = renderHook(useBumpFees, { initialProps })

    await result.current()

    const { getByText, queryByText } = render(<Popup />)
    fireEvent.press(getByText('confirm & send'))
    expect(queryByText('increasing fees')).toBeTruthy()

    await waitFor(() => {
      expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(txDetails.psbt)
      expect(queryByText('increasing fees')).toBeFalsy()
      expect(peachWallet.transactions).toHaveLength(0)
      expect(useWalletState.getState().transactions).toHaveLength(0)
      expect(goBackMock).toHaveBeenCalled()
      expect(replaceMock).toHaveBeenCalledWith('transactionDetails', { txId: newTxId })
    })
  })
  it('should handle finish transaction errors', async () => {
    peachWallet.finishTransaction = jest.fn().mockImplementation(() => {
      throw transactionError
    })

    const { result } = renderHook(useBumpFees, { initialProps })

    await result.current()
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
    expect(peachWallet.transactions).toHaveLength(1)
    expect(useWalletState.getState().transactions).toHaveLength(1)
  })
  it('should handle broadcast errors', async () => {
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(txDetails.psbt)

    peachWallet.signAndBroadcastPSBT = jest.fn().mockImplementation(() => {
      throw transactionError
    })

    const { result } = renderHook(useBumpFees, { initialProps })

    await result.current()
    const { getByText, queryByText } = render(<Popup />)
    fireEvent.press(getByText('confirm & send'))

    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
      expect(queryByText('increasing fees')).toBeFalsy()
      expect(peachWallet.transactions).toHaveLength(1)
      expect(useWalletState.getState().transactions).toHaveLength(1)
    })
  })
})
