import { act, renderHook } from 'test-utils'
import { wronglyFundedSellOffer } from '../../tests/unit/data/offerData'
import { replaceMock } from '../../tests/unit/helpers/NavigationWrapper'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { useShowFundingAmountDifferentPopup } from './useShowFundingAmountDifferentPopup'
import { FundingAmountDifferent } from './warning/FundingAmountDifferent'

describe('useShowFundingAmountDifferentPopup', () => {
  beforeEach(() => {
    usePopupStore.setState(defaultPopupState)
  })

  it('opens funding amount different popup', () => {
    const { result } = renderHook(useShowFundingAmountDifferentPopup)
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
    const { result } = renderHook(useShowFundingAmountDifferentPopup)
    act(() => {
      result.current(wronglyFundedSellOffer)
    })
    usePopupStore.getState().action1?.callback()

    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(replaceMock).toHaveBeenCalledWith('wrongFundingAmount', { offerId: wronglyFundedSellOffer.id })
  })
})
