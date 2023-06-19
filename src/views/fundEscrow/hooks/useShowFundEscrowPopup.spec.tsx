import { renderHook } from '@testing-library/react-native'
import { act } from 'react-test-renderer'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { Loading } from '../../../components'
import { usePopupStore } from '../../../store/usePopupStore'
import tw from '../../../styles/tailwind'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { ConfirmFundingFromPeachWallet } from '../components/ConfirmFundingFromPeachWallet'
import { useShowFundEscrowPopup } from './useShowFundEscrowPopup'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'

const wrapper = NavigationWrapper

describe('useShowFundEscrowPopup', () => {
  const amount = sellOffer.amount
  const address = 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh'
  const feeRate = estimatedFees.halfHourFee
  const fee = feeRate * 110
  const transaction = getTransactionDetails(amount, feeRate)
  const onSuccess = jest.fn()
  const props = {
    address,
    transaction,
    feeRate,
    onSuccess,
  }
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })

  it('should open confirmation popup', async () => {
    peachWallet.balance = amount
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(getTransactionDetails(amount, feeRate))

    const { result } = renderHook(useShowFundEscrowPopup, { wrapper })

    await result.current(props)
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
    peachWallet.balance = amount
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(transaction)
    peachWallet.signAndBroadcastTransaction = jest.fn().mockResolvedValue(transaction)

    const { result } = renderHook(useShowFundEscrowPopup, { wrapper })

    await act(async () => {
      await result.current(props)
    })
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
    await act(async () => {
      await promise
    })

    expect(peachWallet.signAndBroadcastTransaction).toHaveBeenCalledWith(transaction)
    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(onSuccess).toHaveBeenCalled()
  })
})
