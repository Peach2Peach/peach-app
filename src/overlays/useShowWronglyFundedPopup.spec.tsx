import { act, renderHook } from '@testing-library/react-native'
import { useShowWronglyFundedPopup } from './useShowWronglyFundedPopup'
import { WrongFundingAmount } from './warning/WrongFundingAmount'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'

const useOverlayContextMock = jest.fn()
jest.mock('../contexts/overlay', () => ({
  useOverlayContext: () => useOverlayContextMock(),
}))

const startRefundPopupMock = jest.fn()
jest.mock('./useStartRefundPopup', () => ({
  useStartRefundPopup:
    () =>
      (...args: any[]) =>
        startRefundPopupMock(...args),
}))

const useConfigStoreMock = jest.fn((selector) => selector({ maxTradingAmount: 2000000 }))
jest.mock('../store/configStore', () => ({
  useConfigStore: (selector: any) => useConfigStoreMock(selector),
}))

describe('useWronglyFundedOverlay', () => {
  const updateOverlayMock = jest.fn()
  const maxTradingAmount = 2000000

  beforeEach(() => {
    useOverlayContextMock.mockReturnValue([, updateOverlayMock])
    useConfigStoreMock.mockImplementation((selector) => selector({ maxTradingAmount }))
  })
  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
    jest.resetAllMocks()
  })
  it('opens WrongFundingAmount overlay', () => {
    const amount = 100000
    const actualAmount = 110000
    const sellOffer: Partial<SellOffer> = {
      amount,
      funding: {
        amounts: [actualAmount],
      } as FundingStatus,
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
  it('starts refund process', () => {
    const amount = 100000
    const actualAmount = 110000
    const sellOffer: Partial<SellOffer> = {
      amount,
      funding: {
        amounts: [actualAmount],
      } as FundingStatus,
    }
    const { result } = renderHook(() => useShowWronglyFundedPopup())
    act(() => {
      result.current(sellOffer as SellOffer)
    })
    usePopupStore.getState().action1?.callback()
    expect(startRefundPopupMock).toHaveBeenCalledWith(sellOffer)
  })
})
