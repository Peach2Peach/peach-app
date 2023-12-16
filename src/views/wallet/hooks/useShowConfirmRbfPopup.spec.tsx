import { fireEvent, render, renderHook, waitFor } from 'test-utils'
import { transactionError } from '../../../../tests/unit/data/errors'
import { bitcoinTransaction } from '../../../../tests/unit/data/transactionDetailData'
import { PopupLoadingSpinner } from '../../../../tests/unit/helpers/PopupLoadingSpinner'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { Popup, PopupAction } from '../../../components/popup'
import { PopupComponent } from '../../../components/popup/PopupComponent'
import { usePopupStore } from '../../../store/usePopupStore'
import { getTransactionFeeRate } from '../../../utils/bitcoin/getTransactionFeeRate'
import i18n from '../../../utils/i18n'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { ConfirmRbf } from '../components/ConfirmRbf'
import { useShowConfirmRbfPopup } from './useShowConfirmRbfPopup'

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

describe('useShowConfirmRbfPopup', () => {
  const currentFeeRate = getTransactionFeeRate(bitcoinTransaction)
  const newFeeRate = 10
  const onSuccess = jest.fn()
  const txDetails = getTransactionDetails(bitcoinTransaction.value, newFeeRate, bitcoinTransaction.txid)
  const props = {
    currentFeeRate,
    newFeeRate,
    transaction: bitcoinTransaction,
    sendingAmount: 80000,
    finishedTransaction: txDetails.psbt,
    onSuccess,
  }
  beforeEach(() => {
    // @ts-expect-error mock doesn't need args
    setPeachWallet(new PeachWallet())
    useWalletState.getState().addPendingTransactionHex(bitcoinTransaction.txid, 'hex')
  })

  it('should show bump fee confirmation popup', () => {
    const { result } = renderHook(useShowConfirmRbfPopup)

    result.current(props)

    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <PopupComponent
        title={i18n('wallet.bumpNetworkFees.confirmRbf.title')}
        content={
          <ConfirmRbf
            oldFeeRate={currentFeeRate}
            newFeeRate={newFeeRate}
            bytes={bitcoinTransaction.size}
            sendingAmount={80000}
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
  it('should show bump fee confirmation popup with no change warning', () => {
    const { result } = renderHook(useShowConfirmRbfPopup)

    result.current({
      ...props,
      transaction: {
        ...bitcoinTransaction,
        vout: [bitcoinTransaction.vout[0]],
      },
    })

    expect(usePopupStore.getState().popupComponent).toEqual(
      <PopupComponent
        title="increasing fees"
        actions={
          <>
            <PopupAction iconId="xCircle" label="cancel" onPress={expect.any(Function)} />
            <PopupAction
              iconId="arrowRightCircle"
              label="confirm & send"
              onPress={expect.any(Function)}
              reverseOrder={true}
            />
          </>
        }
        content={
          <ConfirmRbf
            oldFeeRate={currentFeeRate}
            newFeeRate={newFeeRate}
            bytes={bitcoinTransaction.size}
            sendingAmount={80000}
            hasNoChange={true}
          />
        }
      />,
    )
  })
  it('should broadcast bump fee transaction', async () => {
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(txDetails.psbt)

    const { result } = renderHook(useShowConfirmRbfPopup)

    result.current(props)
    const { getByText } = render(<Popup />)

    fireEvent.press(getByText(i18n('fundFromPeachWallet.confirm.confirmAndSend')))
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <PopupComponent
        title="increasing fees"
        actions={<PopupAction iconId="clock" label="loading..." onPress={expect.any(Function)} />}
        content={PopupLoadingSpinner}
      />,
    )

    await waitFor(() => {
      expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(txDetails.psbt)
      expect(usePopupStore.getState().visible).toBeFalsy()
      expect(useWalletState.getState().pendingTransactions).toEqual({})
      expect(onSuccess).toHaveBeenCalled()
    })
  })
  it('should handle broadcast errors', async () => {
    peachWallet.signAndBroadcastPSBT = jest.fn().mockImplementation(() => {
      throw transactionError
    })

    const { result } = renderHook(useShowConfirmRbfPopup)
    result.current(props)

    const { getByText } = render(<Popup />)

    fireEvent.press(getByText(i18n('fundFromPeachWallet.confirm.confirmAndSend')))

    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
      expect(usePopupStore.getState().visible).toBeFalsy()
      expect(useWalletState.getState().pendingTransactions).toEqual({
        credacted: 'hex',
      })
    })
  })
})
