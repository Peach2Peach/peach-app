import { act, renderHook } from 'test-utils'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { useShowWronglyFundedPopup } from './useShowWronglyFundedPopup'
import { IncorrectFunding } from './warning/IncorrectFunding'
import { WrongFundingAmount } from './warning/WrongFundingAmount'

const cancelAndStartRefundPopup = jest.fn()
jest.mock('./useCancelAndStartRefundPopup', () => ({
  useCancelAndStartRefundPopup:
    () =>
      (...args: unknown[]) =>
        cancelAndStartRefundPopup(...args),
}))

const useConfigStoreMock = jest.fn((selector) => selector({ maxTradingAmount: 2000000 }))
jest.mock('../store/configStore/configStore', () => ({
  useConfigStore: (selector: unknown) => useConfigStoreMock(selector),
}))

describe('useShowWronglyFundedPopup', () => {
  const maxTradingAmount = 2000000
  const amount = 100000
  const actualAmount = 110000

  beforeEach(() => {
    useConfigStoreMock.mockImplementation((selector) => selector({ maxTradingAmount }))
    usePopupStore.setState(defaultPopupState)
  })
  it('opens WrongFundingAmount popup', () => {
    const sellOffer: Partial<SellOffer> = {
      amount,
      funding: { txIds: ['1'], amounts: [actualAmount] } as FundingStatus,
    }
    const { result } = renderHook(() => useShowWronglyFundedPopup())
    act(() => {
      result.current(sellOffer as SellOffer)
    })

    expect(usePopupStore.getState()).toEqual(
      expect.objectContaining({
        action1: expect.objectContaining({
          callback: expect.any(Function),
          icon: 'arrowRightCircle',
          label: 'refund escrow',
        }),
        content: <WrongFundingAmount actualAmount={actualAmount} amount={amount} maxAmount={maxTradingAmount} />,
        level: 'WARN',
        title: expect.any(String),
        visible: true,
      }),
    )
  })
  it('opens Incorrect Funding popup when funded with multiple transactions', () => {
    const sellOffer: Partial<SellOffer> = {
      amount,
      funding: { txIds: ['1', '2'], amounts: [amount] } as FundingStatus,
    }
    const { result } = renderHook(() => useShowWronglyFundedPopup())
    act(() => {
      result.current(sellOffer as SellOffer)
    })

    expect(usePopupStore.getState()).toEqual(
      expect.objectContaining({
        action1: expect.objectContaining({
          callback: expect.any(Function),
          icon: 'arrowRightCircle',
          label: 'refund escrow',
        }),
        content: <IncorrectFunding utxos={2} />,
        level: 'WARN',
        title: expect.any(String),
        visible: true,
      }),
    )
  })
  it('starts refund process', () => {
    const sellOffer: Partial<SellOffer> = {
      amount,
      funding: { txIds: ['1'], amounts: [actualAmount] } as FundingStatus,
    }
    const { result } = renderHook(() => useShowWronglyFundedPopup())
    act(() => {
      result.current(sellOffer as SellOffer)
    })
    usePopupStore.getState().action1?.callback()
    expect(cancelAndStartRefundPopup).toHaveBeenCalledWith(sellOffer)
  })
})
