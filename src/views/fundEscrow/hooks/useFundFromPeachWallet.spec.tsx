import { renderHook } from '@testing-library/react-native'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { defaultFundingStatus } from '../../../utils/offer/constants'
import { useFundFromPeachWallet } from './useFundFromPeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { act } from 'react-test-renderer'
import { usePopupStore } from '../../../store/usePopupStore'
import { ConfirmFundingFromPeachWallet } from '../components/ConfirmFundingFromPeachWallet'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { Loading } from '../../../components'
import tw from '../../../styles/tailwind'
import { broadcastError } from '../../../../tests/unit/data/errors'

const useFeeEstimateMock = jest.fn().mockReturnValue({ estimatedFees })
jest.mock('../../../hooks/query/useFeeEstimate', () => ({
  useFeeEstimate: () => useFeeEstimateMock(),
}))

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner:
    () =>
      (...args: any[]) =>
        showErrorBannerMock(...args),
}))

describe('useFundFromPeachWallet', () => {
  const amount = sellOffer.amount
  const address = 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh'
  const feeRate = estimatedFees.halfHourFee
  const fee = feeRate * 110
  const offerWithEscrow = { ...sellOffer, escrow: address }
  const initialProps = { offer: offerWithEscrow, fundingStatus: defaultFundingStatus }
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })
  it('should return default values', () => {
    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    expect(result.current).toEqual({
      canFundFromPeachWallet: true,
      fundFromPeachWallet: expect.any(Function),
      fundedFromPeachWallet: false,
    })
  })
  it('should return canFundFromPeachWallet as true if peach wallet has enough funds', () => {
    peachWallet.balance = amount

    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    expect(result.current.canFundFromPeachWallet).toBeTruthy()
  })
  it('should return canFundFromPeachWallet as false if escrow is already being funded', () => {
    peachWallet.balance = amount
    const { result } = renderHook(useFundFromPeachWallet, {
      initialProps: { offer: offerWithEscrow, fundingStatus: { ...defaultFundingStatus, status: 'MEMPOOL' } },
    })

    expect(result.current.canFundFromPeachWallet).toBeFalsy()
  })

  it('should return canFundFromPeachWallet as true after offer has been loaded', async () => {
    peachWallet.balance = amount

    const { result, rerender } = renderHook(useFundFromPeachWallet, {
      initialProps: { fundingStatus: defaultFundingStatus },
    })
    expect(result.current.canFundFromPeachWallet).toBeFalsy()

    await act(() => rerender(initialProps))

    expect(result.current.canFundFromPeachWallet).toBeTruthy()
  })

  it('should not open popup if cannot fund from peach wallet', async () => {
    const { result } = renderHook(useFundFromPeachWallet, {
      initialProps: {
        ...initialProps,
        fundingStatus: {
          ...defaultFundingStatus,
          status: 'MEMPOOL',
        },
      },
    })

    await act(async () => {
      await result.current.fundFromPeachWallet()
    })
    expect(usePopupStore.getState().visible).toBeFalsy()
  })
  it('should open confirmation popup', async () => {
    peachWallet.balance = amount
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(getTransactionDetails(amount, feeRate))

    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    await result.current.fundFromPeachWallet()
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
    const txDetails = getTransactionDetails(amount, feeRate)
    peachWallet.balance = amount
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(txDetails)
    peachWallet.signAndBroadcastTransaction = jest.fn().mockResolvedValue(txDetails)

    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    await act(async () => {
      await result.current.fundFromPeachWallet()
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

    expect(peachWallet.signAndBroadcastTransaction).toHaveBeenCalledWith(txDetails)
    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(result.current.fundedFromPeachWallet).toBeTruthy()
  })
  it('should handle broadcast errors', async () => {
    peachWallet.balance = amount
    peachWallet.signAndBroadcastTransaction = jest.fn().mockImplementation(() => {
      throw broadcastError
    })

    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    await result.current.fundFromPeachWallet()
    await usePopupStore.getState().action1?.callback()
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
    expect(usePopupStore.getState().visible).toBeFalsy()
  })
})
