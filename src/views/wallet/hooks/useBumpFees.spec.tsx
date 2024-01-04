import { fireEvent, render, renderHook, waitFor } from 'test-utils'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { transactionError } from '../../../../tests/unit/data/errors'
import { bitcoinTransaction, pending1 } from '../../../../tests/unit/data/transactionDetailData'
import { goBackMock, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { PopupLoadingSpinner } from '../../../../tests/unit/helpers/PopupLoadingSpinner'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { Popup } from '../../../components/popup'
import { PopupAction } from '../../../components/popup/PopupAction'
import { PopupComponent } from '../../../components/popup/PopupComponent'
import { usePopupStore } from '../../../store/usePopupStore'
import { getTransactionFeeRate } from '../../../utils/bitcoin/getTransactionFeeRate'
import i18n from '../../../utils/i18n'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { ConfirmRbf } from '../components/ConfirmRbf'
import { useBumpFees } from './useBumpFees'

const useFeeEstimateMock = jest.fn().mockReturnValue({ estimatedFees })
jest.mock('../../../hooks/query/useFeeEstimate', () => ({
  useFeeEstimate: () => useFeeEstimateMock(),
}))

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

describe('useBumpFees', () => {
  const currentFeeRate = getTransactionFeeRate(bitcoinTransaction)
  const newFeeRate = 10
  const initialProps = {
    transaction: bitcoinTransaction,
    newFeeRate,
    sendingAmount: bitcoinTransaction.value as number,
  }
  // @ts-ignore
  const peachWallet = new PeachWallet()

  const newTxId = 'newTxId'
  const txDetails = getTransactionDetails(bitcoinTransaction.value, newFeeRate, 'newTxId')

  beforeEach(() => {
    const transactions = [{ ...pending1, txid: bitcoinTransaction.txid, sent: 100000, received: 20000 }]
    peachWallet.transactions = transactions
    setPeachWallet(peachWallet)
    useWalletState.getState().setTransactions(peachWallet.transactions)
  })

  it('should not show bump fee confirmation popup if transaction details could not be loaded', async () => {
    const { result } = renderHook(useBumpFees, { initialProps: { ...initialProps, transaction: undefined } })

    await result.current()

    expect(usePopupStore.getState().visible).toBeFalsy()
  })
  it('should show bump fee confirmation popup', async () => {
    const { result } = renderHook(useBumpFees, { initialProps })

    await result.current()

    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <PopupComponent
        title={i18n('wallet.bumpNetworkFees.confirmRbf.title')}
        content={
          <ConfirmRbf
            oldFeeRate={currentFeeRate}
            newFeeRate={newFeeRate}
            bytes={bitcoinTransaction.size}
            sendingAmount={223667}
            hasNoChange={false}
          />
        }
        actions={
          <>
            <PopupAction label={i18n('cancel')} iconId="xCircle" onPress={expect.any(Function)} />
            <PopupAction
              label={i18n('fundFromPeachWallet.confirm.confirmAndSend')}
              iconId="arrowRightCircle"
              onPress={expect.any(Function)}
              reverseOrder
            />
          </>
        }
      />,
    )
  })

  it('should broadcast bump fee transaction', async () => {
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(txDetails.psbt)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(txDetails.psbt)

    const { result } = renderHook(useBumpFees, { initialProps })

    await result.current()

    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('confirm & send'))

    expect(usePopupStore.getState().popupComponent).toEqual(
      <PopupComponent
        title="increasing fees"
        actions={<PopupAction iconId="clock" label="loading..." onPress={expect.any(Function)} />}
        content={PopupLoadingSpinner}
      />,
    )

    await waitFor(() => {
      expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(txDetails.psbt)
      expect(usePopupStore.getState().visible).toBeFalsy()
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
    expect(usePopupStore.getState().visible).toBeFalsy()
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
    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('confirm & send'))

    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
      expect(usePopupStore.getState().visible).toBeFalsy()
      expect(peachWallet.transactions).toHaveLength(1)
      expect(useWalletState.getState().transactions).toHaveLength(1)
    })
  })
})
