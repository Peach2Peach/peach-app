import { renderHook } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { transactionError } from '../../../../tests/unit/data/errors'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { PopupLoadingSpinner } from '../../../../tests/unit/helpers/PopupLoadingSpinner'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { usePopupStore } from '../../../store/usePopupStore'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { ConfirmFundingFromPeachWallet } from '../components/ConfirmFundingFromPeachWallet'
import { useShowConfirmTransactionPopup } from './useShowConfirmTransactionPopup'

const wrapper = NavigationWrapper

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner:
    () =>
      (...args: unknown[]) =>
        showErrorBannerMock(...args),
}))

describe('useShowConfirmTransactionPopup', () => {
  const amount = sellOffer.amount
  const address = 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh'
  const feeRate = estimatedFees.halfHourFee
  const fee = feeRate * 110
  const transaction = getTransactionDetails(amount, feeRate)
  const onSuccess = jest.fn()
  const props = {
    title: 'funding escrow',
    content: <ConfirmFundingFromPeachWallet {...{ amount, address, fee, feeRate }} />,
    transaction,
    onSuccess,
  }
  beforeEach(() => {
    // @ts-expect-error mock doesn't need args
    setPeachWallet(new PeachWallet())
  })

  it('should open confirmation popup', () => {
    const { result } = renderHook(useShowConfirmTransactionPopup, { wrapper })

    result.current(props)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'funding escrow',
      level: 'APP',
      content: <ConfirmFundingFromPeachWallet {...{ amount, address, fee, feeRate }} />,
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
  it('should broadcast transaction on confirm', async () => {
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(transaction.psbt)

    const { result } = renderHook(useShowConfirmTransactionPopup, { wrapper })

    await act(() => result.current(props))
    const promise = usePopupStore.getState().action1?.callback()

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'funding escrow',
      level: 'APP',
      content: PopupLoadingSpinner,
      action1: {
        label: 'loading...',
        icon: 'clock',
        callback: expect.any(Function),
      },
    })
    await act(() => promise)

    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(transaction.psbt)
    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(onSuccess).toHaveBeenCalled()
  })
  it('should handle broadcast errors', async () => {
    peachWallet.balance = amount
    peachWallet.signAndBroadcastPSBT = jest.fn().mockImplementation(() => {
      throw transactionError
    })

    const { result } = renderHook(useShowConfirmTransactionPopup, { wrapper })

    result.current(props)
    await usePopupStore.getState().action1?.callback()
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
    expect(usePopupStore.getState().visible).toBeFalsy()
  })
})
