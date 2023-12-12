import { renderHook } from 'test-utils'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { transactionError } from '../../../../tests/unit/data/errors'
import { bitcoinTransaction, pending1 } from '../../../../tests/unit/data/transactionDetailData'
import { goBackMock, replaceMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { PopupLoadingSpinner } from '../../../../tests/unit/helpers/PopupLoadingSpinner'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { usePopupStore } from '../../../store/usePopupStore'
import { getTransactionFeeRate } from '../../../utils/bitcoin/getTransactionFeeRate'
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
  useShowErrorBanner:
    () =>
      (...args: unknown[]) =>
        showErrorBannerMock(...args),
}))

describe('useBumpFees', () => {
  const currentFeeRate = getTransactionFeeRate(bitcoinTransaction)
  const newFeeRate = 10
  const initialProps = {
    transaction: bitcoinTransaction,
    newFeeRate,
    sendingAmount: bitcoinTransaction.value as number,
  }
  // @ts-expect-error mock doesn't need args
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

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'increasing fees',
      level: 'APP',
      content: (
        <ConfirmRbf
          oldFeeRate={currentFeeRate}
          newFeeRate={newFeeRate}
          bytes={bitcoinTransaction.size}
          hasNoChange={false}
          sendingAmount={initialProps.sendingAmount}
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
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(txDetails.psbt)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(txDetails.psbt)

    const { result } = renderHook(useBumpFees, { initialProps })

    await result.current()
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
    expect(peachWallet.transactions).toHaveLength(0)
    expect(useWalletState.getState().transactions).toHaveLength(0)
    expect(goBackMock).toHaveBeenCalled()
    expect(replaceMock).toHaveBeenCalledWith('transactionDetails', { txId: newTxId })
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
    await usePopupStore.getState().action1?.callback()
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(peachWallet.transactions).toHaveLength(1)
    expect(useWalletState.getState().transactions).toHaveLength(1)
  })
})
