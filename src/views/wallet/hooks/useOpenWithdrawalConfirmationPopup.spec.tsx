import { act } from 'react-test-renderer'
import { renderHook } from 'test-utils'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { transactionError } from '../../../../tests/unit/data/errors'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'
import { usePopupStore } from '../../../store/usePopupStore'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'
import { useOpenWithdrawalConfirmationPopup } from './useOpenWithdrawalConfirmationPopup'

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner: () => showErrorBannerMock,
}))

const amount = sellOffer.amount
const address = 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh'
const feeRate = estimatedFees.halfHourFee
const TX_SIZE = 110
const fee = feeRate * TX_SIZE
const transaction = getTransactionDetails(amount, feeRate)
const transactionWithChange = getTransactionDetails(amount, feeRate)
const changeAmount = 5000
transactionWithChange.txDetails.sent = sellOffer.amount + changeAmount

const props = {
  address,
  amount,
  feeRate,
  shouldDrainWallet: false,
}
jest.mock('../../../utils/wallet/transaction/buildTransaction', () => ({
  buildTransaction: jest.fn(() => transaction),
}))

describe('useOpenWithdrawalConfirmationPopup', () => {
  beforeEach(() => {
    // @ts-expect-error mock doesn't need args
    setPeachWallet(new PeachWallet())
  })

  it('should open confirmation popup', async () => {
    peachWallet.buildFinishedTransaction = jest.fn().mockResolvedValue(transaction)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(transaction.psbt)

    const { result } = renderHook(useOpenWithdrawalConfirmationPopup)

    await result.current(props)
    expect(usePopupStore.getState()).toEqual(
      expect.objectContaining({
        title: 'sending funds',
        level: 'APP',
        content: <WithdrawalConfirmation {...{ ...props, fee }} />,
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
      }),
    )
  })

  it('should broadcast transaction, reset state and navigate to wallet on confirm', async () => {
    peachWallet.buildFinishedTransaction = jest.fn().mockResolvedValue(transaction)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(transaction.psbt)

    const { result } = renderHook(useOpenWithdrawalConfirmationPopup)

    await act(async () => {
      await result.current(props)
    })
    const promise = usePopupStore.getState().action1?.callback()

    await act(async () => {
      await promise
    })

    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(transaction.psbt)
    expect(usePopupStore.getState().visible).toBe(false)
    expect(useWalletState.getState().selectedUTXOIds).toEqual([])
    expect(navigateMock).toHaveBeenCalledWith('homeScreen', { screen: 'wallet' })
  })

  it('should be able to send all funds', async () => {
    peachWallet.buildFinishedTransaction = jest.fn().mockResolvedValue(transaction)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(transaction.psbt)

    const { result } = renderHook(useOpenWithdrawalConfirmationPopup)

    await act(async () => {
      await result.current({ ...props, shouldDrainWallet: true })
    })
    const promise = usePopupStore.getState().action1?.callback()

    await act(async () => {
      await promise
    })

    expect(peachWallet.buildFinishedTransaction).toHaveBeenCalledWith({
      address: 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh',
      amount: 250000,
      feeRate: 6,
      shouldDrainWallet: true,
      utxos: undefined,
    })
    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(transaction.psbt)
  })

  it('should close popup on cancel', async () => {
    peachWallet.buildFinishedTransaction = jest.fn().mockResolvedValue(transaction)
    const { result } = renderHook(useOpenWithdrawalConfirmationPopup)

    await act(async () => {
      await result.current(props)
    })
    usePopupStore.getState().action2?.callback()

    expect(usePopupStore.getState().visible).toBe(false)
  })
  it('should handle build errors', async () => {
    peachWallet.buildFinishedTransaction = jest.fn().mockImplementation(() => {
      throw transactionError
    })

    const { result } = renderHook(useOpenWithdrawalConfirmationPopup)

    await act(async () => {
      await result.current(props)
    })
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
    expect(usePopupStore.getState().visible).toBeFalsy()
  })
  it('should handle broadcast errors', async () => {
    peachWallet.buildFinishedTransaction = jest.fn().mockResolvedValue(transaction)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockImplementation(() => {
      throw transactionError
    })

    const { result } = renderHook(useOpenWithdrawalConfirmationPopup)

    await act(async () => {
      await result.current(props)
    })
    const promise = usePopupStore.getState().action1?.callback()

    await act(async () => {
      await promise
    })
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
    expect(usePopupStore.getState().visible).toBeFalsy()
  })
})
