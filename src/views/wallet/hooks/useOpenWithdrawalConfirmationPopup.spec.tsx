import { renderHook } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { transactionError } from '../../../../tests/unit/data/errors'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { WithdrawalConfirmation } from '../../../popups/WithdrawalConfirmation'
import { usePopupStore } from '../../../store/usePopupStore'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { useOpenWithdrawalConfirmationPopup } from './useOpenWithdrawalConfirmationPopup'

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner:
    () =>
      (...args: any[]) =>
        showErrorBannerMock(...args),
}))

const amount = sellOffer.amount
const address = 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh'
const feeRate = estimatedFees.halfHourFee
const fee = feeRate * 110
const transaction = getTransactionDetails(amount, feeRate)
const transactionWithChange = getTransactionDetails(amount, feeRate)
transactionWithChange.txDetails.sent = sellOffer.amount + 5000

const onSuccess = jest.fn()
const props = {
  address,
  amount,
  feeRate,
  shouldDrainWallet: false,
  onSuccess,
}
jest.mock('../../../utils/wallet/transaction/buildDrainWalletTransaction', () => ({
  buildDrainWalletTransaction: jest.fn(() => transaction),
}))

const wrapper = NavigationWrapper

describe('useOpenWithdrawalConfirmationPopup', () => {
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })

  it('should open confirmation popup', async () => {
    peachWallet.buildAndFinishTransaction = jest.fn().mockResolvedValue(transaction)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(transaction.psbt)

    const { result } = renderHook(useOpenWithdrawalConfirmationPopup, { wrapper })

    await result.current(props)
    expect(usePopupStore.getState()).toEqual(
      expect.objectContaining({
        title: 'sending funds',
        level: 'APP',
        content: <WithdrawalConfirmation {...{ address, amount, fee, feeRate }} />,
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

  it('should broadcast transaction on confirm', async () => {
    peachWallet.buildAndFinishTransaction = jest.fn().mockResolvedValue(transaction)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(transaction.psbt)

    const { result } = renderHook(useOpenWithdrawalConfirmationPopup, { wrapper })

    await act(async () => {
      await result.current(props)
    })
    const promise = usePopupStore.getState().action1?.callback()

    await act(async () => {
      await promise
    })

    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(transaction.psbt)
    expect(onSuccess).toHaveBeenCalled()
  })

  it('should be able to send all funds', async () => {
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(transaction)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(transaction.psbt)

    const { result } = renderHook(useOpenWithdrawalConfirmationPopup, { wrapper })

    await act(async () => {
      await result.current({ ...props, shouldDrainWallet: true })
    })
    const promise = usePopupStore.getState().action1?.callback()

    await act(async () => {
      await promise
    })

    expect(peachWallet.finishTransaction).toHaveBeenCalledWith(transaction)
    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(transaction.psbt)
    expect(onSuccess).toHaveBeenCalled()
  })

  it('should close popup on cancel', async () => {
    peachWallet.buildAndFinishTransaction = jest.fn().mockResolvedValue(transaction)
    const { result } = renderHook(useOpenWithdrawalConfirmationPopup, { wrapper })

    await act(async () => {
      await result.current(props)
    })
    usePopupStore.getState().action2?.callback()

    expect(usePopupStore.getState().visible).toBe(false)
  })

  it('should handle broadcast errors', async () => {
    peachWallet.balance = amount
    peachWallet.buildAndFinishTransaction = jest.fn().mockImplementation(() => {
      throw transactionError
    })

    const { result } = renderHook(useOpenWithdrawalConfirmationPopup, { wrapper })

    await result.current(props)
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
    expect(usePopupStore.getState().visible).toBeFalsy()
  })

  it.todo('should send from the selected coins only, if any are selected')
})
