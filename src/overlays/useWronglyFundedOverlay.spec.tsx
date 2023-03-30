import { act, renderHook } from '@testing-library/react-native'
import { useConfigStore } from '../store/configStore'
import { useWronglyFundedOverlay } from './useWronglyFundedOverlay'
import { WrongFundingAmount } from './warning/WrongFundingAmount'

const navigateMock = jest.fn()
jest.mock('../hooks/useNavigation', () => ({
  useNavigation: jest.fn().mockReturnValue({
    navigate: () => navigateMock(),
  }),
}))

const useOverlayContextMock = jest.fn()
jest.mock('../contexts/overlay', () => ({
  useOverlayContext: () => useOverlayContextMock(),
}))
const useStartRefundOverlayMock = jest.fn()
jest.mock('./useStartRefundOverlay', () => ({
  useStartRefundOverlay: () => useStartRefundOverlayMock(),
}))

const useConfigStoreMock = jest.fn()
jest.mock('../store/configStore', () => ({
  useConfigStore: () => useConfigStoreMock(),
}))

describe('useWronglyFundedOverlay', () => {
  const updateOverlayMock = jest.fn()
  const maxTradingAmount = 2000000

  beforeEach(() => {
    useOverlayContextMock.mockReturnValue([, updateOverlayMock])
    useConfigStoreMock.mockReturnValue(maxTradingAmount)
  })
  afterEach(() => {
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
    const { result } = renderHook(() => useWronglyFundedOverlay())
    act(() => {
      result.current(sellOffer as SellOffer)
    })

    expect(updateOverlayMock).toHaveBeenCalledWith({
      action1: expect.objectContaining({
        callback: expect.any(Function),
        icon: expect.any(String),
        label: expect.any(String),
      }),
      content: <WrongFundingAmount actualAmount={actualAmount} amount={amount} maxAmount={maxTradingAmount} />,
      level: 'WARN',
      title: expect.any(String),
      visible: true,
    })
  })
})
