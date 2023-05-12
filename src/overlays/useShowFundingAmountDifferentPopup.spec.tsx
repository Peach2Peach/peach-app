import { act, renderHook } from '@testing-library/react-native'
import { sellOffer } from '../../tests/unit/data/offerData'
import { NavigationWrapper, replaceMock } from '../../tests/unit/helpers/NavigationWrapper'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { useShowFundingAmountDifferentPopup } from './useShowFundingAmountDifferentPopup'
import { FundingAmountDifferent } from './warning/FundingAmountDifferent'

const wrapper = NavigationWrapper

describe('useShowFundingAmountDifferentPopup', () => {
  const amount = 42069
  const actualAmount = 69420
  const wronglyFundedSellOffer: SellOffer = {
    ...sellOffer,
    amount,
    funding: { amounts: [actualAmount] } as FundingStatus,
  }
  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
    jest.resetAllMocks()
  })

  it('opens funding amount different overlay', () => {
    const { result } = renderHook(useShowFundingAmountDifferentPopup, { wrapper })
    act(() => {
      result.current(wronglyFundedSellOffer)
    })

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'different amounts',
      content: <FundingAmountDifferent {...{ amount, actualAmount }} />,
      visible: true,
      level: 'WARN',
      action1: {
        label: 'go to trade',
        icon: 'arrowRightCircle',
        callback: expect.any(Function),
      },
    })
  })
  it('navigates to wrongFundingAmount', () => {
    const { result } = renderHook(useShowFundingAmountDifferentPopup, { wrapper })
    act(() => {
      result.current(wronglyFundedSellOffer)
    })
    usePopupStore.getState().action1?.callback()

    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(replaceMock).toHaveBeenCalledWith('wrongFundingAmount', { offerId: wronglyFundedSellOffer.id })
  })
})
