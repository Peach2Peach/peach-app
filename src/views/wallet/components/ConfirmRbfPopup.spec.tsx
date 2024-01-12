import { fireEvent, render, waitFor } from 'test-utils'
import { transactionError } from '../../../../tests/unit/data/errors'
import { bitcoinTransaction } from '../../../../tests/unit/data/transactionDetailData'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { getTransactionFeeRate } from '../../../utils/bitcoin/getTransactionFeeRate'
import i18n from '../../../utils/i18n'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { ConfirmRbfPopup } from './ConfirmRbfPopup'

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))
jest.useFakeTimers()

describe('ConfirmRbfPopup', () => {
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
  })

  it('should broadcast bump fee transaction', async () => {
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(txDetails.psbt)

    const { getByText } = render(<ConfirmRbfPopup {...props} />)

    fireEvent.press(getByText(i18n('fundFromPeachWallet.confirm.confirmAndSend')))

    await waitFor(() => {
      expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(txDetails.psbt)
      expect(onSuccess).toHaveBeenCalled()
    })
  })
  it('should handle broadcast errors', async () => {
    peachWallet.signAndBroadcastPSBT = jest.fn().mockImplementation(() => {
      throw transactionError
    })

    const { getByText } = render(<ConfirmRbfPopup {...props} />)

    fireEvent.press(getByText(i18n('fundFromPeachWallet.confirm.confirmAndSend')))

    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
    })
  })
})
