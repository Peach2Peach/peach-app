import { renderHook } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { Loading } from '../../../components'
import { usePopupStore } from '../../../store/usePopupStore'
import tw from '../../../styles/tailwind'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { ConfirmFundingWithInsufficientFunds } from '../components/ConfirmFundingWithInsufficientFunds'
import { useShowInsufficientFundsPopup } from './useShowInsufficientFundsPopup'

const wrapper = NavigationWrapper
describe('useShowInsufficientFundsPopup', () => {
  const amount = sellOffer.amount
  const address = 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh'
  const feeRate = estimatedFees.halfHourFee
  const fee = feeRate * 110
  const transaction = getTransactionDetails(amount, feeRate)
  const transactionWithChange = getTransactionDetails(amount, feeRate)
  transactionWithChange.txDetails.sent = sellOffer.amount + 5000
  transactionWithChange.txDetails.received = 5000
  const onSuccess = jest.fn()
  const props = {
    address,
    transaction,
    feeRate,
    onSuccess,
  }
  const propsWithChange = { ...props, transaction: transactionWithChange }

  beforeEach(() => {
    // @ts-expect-error mock doesn't need args
    setPeachWallet(new PeachWallet())
  })
  it('should open insufficient funds popup', async () => {
    const { result } = renderHook(useShowInsufficientFundsPopup, { wrapper })

    await result.current(props)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'insufficient funds',
      level: 'APP',
      content: <ConfirmFundingWithInsufficientFunds {...{ amount, address, fee, feeRate }} />,
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

  it('should open insufficient funds popup with change considered', async () => {
    const { result } = renderHook(useShowInsufficientFundsPopup, { wrapper })

    await result.current(propsWithChange)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      content: <ConfirmFundingWithInsufficientFunds {...{ amount, address, fee, feeRate }} />,
    })
  })

  it('should broadcast withdraw all transaction on confirm', async () => {
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(transaction.psbt)

    const { result } = renderHook(useShowInsufficientFundsPopup, { wrapper })

    await act(() => result.current(props))
    const promise = usePopupStore.getState().action1?.callback()

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'funding escrow',
      level: 'APP',
      content: <Loading color={tw`text-black-1`.color} style={tw`self-center`} />,
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
})
