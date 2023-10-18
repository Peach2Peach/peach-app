/* eslint-disable max-lines */
import { TxBuilder } from 'bdk-rn'
import { act } from 'react-test-renderer'
import { renderHook } from 'test-utils'
import { estimatedFees } from '../../../../tests/unit/data/bitcoinNetworkData'
import { transactionError } from '../../../../tests/unit/data/errors'
import { sellOffer } from '../../../../tests/unit/data/offerData'
import { PopupLoadingSpinner } from '../../../../tests/unit/helpers/PopupLoadingSpinner'
import { getTransactionDetails } from '../../../../tests/unit/helpers/getTransactionDetails'
import { useConfigStore } from '../../../store/configStore'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import { defaultFundingStatus } from '../../../utils/offer/constants'
import { PeachWallet } from '../../../utils/wallet/PeachWallet'
import { peachWallet, setPeachWallet } from '../../../utils/wallet/setWallet'
import { AmountTooLow } from '../components/AmountTooLow'
import { ConfirmFundingFromPeachWallet } from '../components/ConfirmFundingFromPeachWallet'
import { ConfirmFundingWithInsufficientFunds } from '../components/ConfirmFundingWithInsufficientFunds'
import { useFundFromPeachWallet } from './useFundFromPeachWallet'

const useFeeEstimateMock = jest.fn().mockReturnValue({ estimatedFees })
jest.mock('../../../hooks/query/useFeeEstimate', () => ({
  useFeeEstimate: () => useFeeEstimateMock(),
}))

const setMultipleRecipientsMock = jest.fn()
jest.mock('../../../utils/wallet/transaction/setMultipleRecipients', () => ({
  setMultipleRecipients: (...args: unknown[]) => setMultipleRecipientsMock(...args),
}))

const showErrorBannerMock = jest.fn()
jest.mock('../../../hooks/useShowErrorBanner', () => ({
  useShowErrorBanner:
    () =>
      (...args: unknown[]) =>
        showErrorBannerMock(...args),
}))

// eslint-disable-next-line max-lines-per-function, max-statements
describe('useFundFromPeachWallet', () => {
  const offerId = sellOffer.id
  const amount = sellOffer.amount
  const minTradingAmount = 50000
  const address = 'bcrt1q70z7vw93cxs6jx7nav9cmcn5qvlv362qfudnqmz9fnk2hjvz5nus4c0fuh'
  const feeRate = estimatedFees.halfHourFee
  const fee = feeRate * 110
  const initialProps = { offerId, address, amount: 615000, fundingStatus: defaultFundingStatus }

  beforeAll(() => {
    useConfigStore.getState().setMinTradingAmount(minTradingAmount)
    usePopupStore.setState(defaultPopupState)
  })
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
      initialProps: { offerId, address, amount: 6150000, fundingStatus: { ...defaultFundingStatus, status: 'MEMPOOL' } },
    })

    expect(result.current.canFundFromPeachWallet).toBeFalsy()
  })

  it('should return canFundFromPeachWallet as true after offer has been loaded', async () => {
    peachWallet.balance = amount

    const { result, rerender } = renderHook(useFundFromPeachWallet, {
      initialProps: { offerId, fundingStatus: defaultFundingStatus },
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
  it('should handle other finishTransaction transaction errors', async () => {
    peachWallet.balance = amount
    peachWallet.finishTransaction = jest.fn().mockImplementationOnce(() => {
      throw Error('UNAUTHORIZED')
    })
    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    await result.current.fundFromPeachWallet()
    expect(showErrorBannerMock).toHaveBeenCalledWith('UNAUTHORIZED')
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
  it('should set multiple recipients if addresses is passed', async () => {
    peachWallet.balance = amount
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(getTransactionDetails(amount, feeRate))
    const addresses = ['a', 'b']
    const { result } = renderHook(useFundFromPeachWallet, { initialProps: { ...initialProps, addresses } })

    await result.current.fundFromPeachWallet()
    expect(setMultipleRecipientsMock).toHaveBeenCalledWith(expect.any(TxBuilder), initialProps.amount, addresses)
  })
  it('should broadcast transaction on confirm', async () => {
    const txDetails = getTransactionDetails(amount, feeRate)
    peachWallet.balance = amount
    peachWallet.finishTransaction = jest.fn().mockResolvedValue(txDetails)
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(txDetails.psbt)

    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    await act(async () => {
      await result.current.fundFromPeachWallet()
    })
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
    await act(async () => {
      await promise
    })

    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(txDetails.psbt)
    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(result.current.fundedFromPeachWallet).toBeTruthy()
  })
  it('should handle broadcast errors', async () => {
    peachWallet.balance = amount
    peachWallet.signAndBroadcastPSBT = jest.fn().mockImplementation(() => {
      throw transactionError
    })

    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    await result.current.fundFromPeachWallet()
    await usePopupStore.getState().action1?.callback()
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
    expect(usePopupStore.getState().visible).toBeFalsy()
  })

  it('should open insufficient funds popup', async () => {
    let call = 0
    peachWallet.balance = amount
    peachWallet.finishTransaction = jest.fn().mockImplementation(() => {
      call++
      if (call === 1) throw transactionError
      return getTransactionDetails(amount, feeRate)
    })

    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    await result.current.fundFromPeachWallet()
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

  it('should open handle insufficient funds error for building drain wallet transactions', async () => {
    peachWallet.balance = amount
    peachWallet.finishTransaction = jest.fn().mockImplementation(() => {
      throw transactionError
    })

    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    await result.current.fundFromPeachWallet()
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', ['78999997952', '1089000'])
  })
  it('should open handle other errors for building drain wallet transactions', async () => {
    let call = 0
    peachWallet.balance = amount
    peachWallet.finishTransaction = jest.fn().mockImplementation(() => {
      call++
      if (call === 1) throw transactionError
      // eslint-disable-next-line no-throw-literal
      throw [new Error('UNKNOWN')]
    })

    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    await result.current.fundFromPeachWallet()
    expect(showErrorBannerMock).toHaveBeenCalledWith('UNKNOWN', [])
  })

  it('should not show insufficient funds popup but error for multiple addresses', async () => {
    let call = 0
    peachWallet.balance = amount
    peachWallet.finishTransaction = jest.fn().mockImplementation(() => {
      call++
      if (call === 1) throw transactionError
      return getTransactionDetails(amount, feeRate)
    })
    const addresses = ['a', 'b']
    const { result } = renderHook(useFundFromPeachWallet, { initialProps: { ...initialProps, addresses } })

    await result.current.fundFromPeachWallet()
    expect(showErrorBannerMock).toHaveBeenCalledWith('INSUFFICIENT_FUNDS', [615000, '1089000'])
  })

  it('should broadcast withdraw all transaction on confirm', async () => {
    const txDetails = getTransactionDetails(amount, feeRate)
    let call = 0
    peachWallet.balance = amount
    peachWallet.finishTransaction = jest.fn().mockImplementation(() => {
      call++
      if (call === 1) throw transactionError
      return txDetails
    })
    peachWallet.signAndBroadcastPSBT = jest.fn().mockResolvedValue(txDetails.psbt)

    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    await act(async () => {
      await result.current.fundFromPeachWallet()
    })
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
    await act(async () => {
      await promise
    })

    expect(peachWallet.signAndBroadcastPSBT).toHaveBeenCalledWith(txDetails.psbt)
    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(result.current.fundedFromPeachWallet).toBeTruthy()
  })

  it('should open amount too low popup', async () => {
    peachWallet.balance = 0
    const { result } = renderHook(useFundFromPeachWallet, { initialProps })

    await result.current.fundFromPeachWallet()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'amount too low',
      level: 'APP',
      content: <AmountTooLow available={0} needed={minTradingAmount} />,
    })
  })
  it('should open amount too low popup when funding multiple', async () => {
    peachWallet.balance = 0
    const addresses = ['a', 'b', 'c']
    const { result } = renderHook(useFundFromPeachWallet, { initialProps: { ...initialProps, addresses } })

    await result.current.fundFromPeachWallet()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'amount too low',
      level: 'APP',
      content: <AmountTooLow available={0} needed={minTradingAmount * 3} />,
    })
  })
})
