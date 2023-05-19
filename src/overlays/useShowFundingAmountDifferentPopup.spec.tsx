import { act, renderHook } from '@testing-library/react-native'
import { wronglyFundedSellOffer } from '../../tests/unit/data/offerData'
import { NavigationWrapper, replaceMock } from '../../tests/unit/helpers/NavigationWrapper'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { useShowFundingAmountDifferentPopup } from './useShowFundingAmountDifferentPopup'
import { FundingAmountDifferent } from './warning/FundingAmountDifferent'

const wrapper = NavigationWrapper

describe('useShowFundingAmountDifferentPopup', () => {
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
      content: (
        <FundingAmountDifferent
          {...{ amount: wronglyFundedSellOffer.amount, actualAmount: wronglyFundedSellOffer.funding.amounts[0] }}
        />
      ),
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
