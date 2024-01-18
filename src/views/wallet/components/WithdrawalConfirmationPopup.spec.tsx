import { fireEvent, render, waitFor } from 'test-utils'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { transactionError } from '../../../../tests/unit/data/errors'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { WithdrawalConfirmationPopup } from './WithdrawalConfirmationPopup'

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

const amount = sellOffer.amount
const address = 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh'
const feeRate = estimatedFees.halfHourFee
const transaction = getTransactionDetails(amount, feeRate)
const transactionWithChange = getTransactionDetails(amount, feeRate)
const changeAmount = 5000
transactionWithChange.txDetails.sent = sellOffer.amount + changeAmount

const props = {
  address,
  amount,
  feeRate,
  psbt: transaction.psbt,
}
jest.mock('../../../utils/wallet/transaction/buildTransaction', () => ({
  buildTransaction: jest.fn(() => transaction),
}))
jest.useFakeTimers()

describe('useOpenWithdrawalConfirmationPopup', () => {
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet({}))
  })

  it('should broadcast transaction, reset state and navigate to wallet on confirm', async () => {
    peachWallet.buildFinishedTransaction = jest.fn().mockResolvedValue(transaction)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(transaction.psbt)
    const fee = await transaction.psbt.feeRate()

    const { getByText } = render(<WithdrawalConfirmationPopup {...props} fee={fee} />)
    fireEvent.press(getByText('confirm & send'))

    await waitFor(() => {
      expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(transaction.psbt)
      expect(useWalletState.getState().selectedUTXOIds).toEqual([])
      expect(navigateMock).toHaveBeenCalledWith('homeScreen', { screen: 'wallet' })
    })
  })
  it('should handle broadcast errors', async () => {
    peachWallet.buildFinishedTransaction = jest.fn().mockResolvedValue(transaction)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockImplementation(() => {
      throw transactionError
    })
    const fee = await transaction.psbt.feeRate()

    const { getByText } = render(<WithdrawalConfirmationPopup {...props} fee={fee} />)

    fireEvent.press(getByText('confirm & send'))

    await waitFor(() => {
      expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
    })
  })
})
