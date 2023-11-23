import { renderHook } from 'test-utils'
import { transactionError } from '../../../../tests/unit/data/errors'
import { bitcoinTransaction } from '../../../../tests/unit/data/transactionDetailData'
import { PopupLoadingSpinner } from '../../../../tests/unit/helpers/PopupLoadingSpinner'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { usePopupStore } from '../../../store/usePopupStore'
import { getTransactionFeeRate } from '../../../utils/bitcoin'
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
          hasNoChange={false}
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
  it('should show bump fee confirmation popup with no change warning', () => {
    const { result } = renderHook(useShowConfirmRbfPopup)

    result.current({
      ...props,
      transaction: {
        ...bitcoinTransaction,
        vout: [bitcoinTransaction.vout[0]],
      },
    })

    expect(usePopupStore.getState().content).toEqual(
      <ConfirmRbf
        oldFeeRate={currentFeeRate}
        newFeeRate={newFeeRate}
        bytes={bitcoinTransaction.size}
        sendingAmount={80000}
        hasNoChange={true}
      />,
    )
  })
  it('should broadcast bump fee transaction', async () => {
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(txDetails.psbt)

    const { result } = renderHook(useShowConfirmRbfPopup)

    result.current(props)
    const promise = usePopupStore.getState().action1?.callback()

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'increasing fees',
      level: 'APP',
      content: PopupLoadingSpinner,
      action1: {
        label: 'loading...',
        icon: 'clock',
        callback: expect.any(Function),
      },
    })

    await promise

    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(txDetails.psbt)
    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(useWalletState.getState().pendingTransactions).toEqual({})
    expect(onSuccess).toHaveBeenCalled()
  })
  it('should handle broadcast errors', async () => {
    peachWallet.signAndBroadcastPSBT = jest.fn().mockImplementation(() => {
      throw transactionError
    })

    const { result } = renderHook(useShowConfirmRbfPopup)
    result.current(props)

    await usePopupStore.getState().action1?.callback()
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(useWalletState.getState().pendingTransactions).toEqual({
      credacted: 'hex',
    })
  })
})
