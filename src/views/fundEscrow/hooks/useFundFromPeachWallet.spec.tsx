import { renderHook } from '@testing-library/react-native'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { defaultFundingStatus } from '../../../utils/offer/constants'
import { useFundFromPeachWallet } from './useFundFromPeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { act } from 'react-test-renderer'
import { usePopupStore } from '../../../store/usePopupStore'
import { ConfirmFundingFromPeachWallet } from '../components/ConfirmFundingFromPeachWallet'

describe('useFundFromPeachWallet', () => {
  const amount = sellOffer.amount
  const address = 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh'
  const fee = 110
  const feeRate = 1
  const offerWithEscrow = { ...sellOffer, escrow: address }
  const initialProps = { offer: offerWithEscrow, fundingStatus: defaultFundingStatus }
  beforeEach(() => {
    // @ts-ignore
    setPeachWallet(new PeachWallet())
  })
  it('should return default values', () => {
    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    expect(result.current).toEqual({
      canFundFromPeachWallet: false,
      fundFromPeachWallet: expect.any(Function),
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
    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    await result.current.fundFromPeachWallet()
    expect(usePopupStore.getState().visible).toBeFalsy()
  })
  it('should open confirmation popup', () => {
    peachWallet.balance = amount

    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    result.current.fundFromPeachWallet()
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

  // await act(result.current.fundFromPeachWallet)
})
