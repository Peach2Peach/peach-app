import { act, fireEvent, render, renderHook } from 'test-utils'
import { wronglyFundedSellOffer } from '../../tests/unit/data/offerData'
import { navigateMock } from '../../tests/unit/helpers/NavigationWrapper'
import { Popup } from '../components/popup/Popup'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { useShowFundingAmountDifferentPopup } from './useShowFundingAmountDifferentPopup'

describe('useShowFundingAmountDifferentPopup', () => {
  beforeEach(() => {
    usePopupStore.setState(defaultPopupState)
  })

  it('opens funding amount different popup', () => {
    const { result } = renderHook(useShowFundingAmountDifferentPopup)
    act(() => {
      result.current(wronglyFundedSellOffer)
    })

    expect(render(<Popup />)).toMatchSnapshot()
  })
  it('navigates to wrongFundingAmount', () => {
    const { result } = renderHook(useShowFundingAmountDifferentPopup)
    act(() => {
      result.current(wronglyFundedSellOffer)
    })
    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('go to trade'))

    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(navigateMock).toHaveBeenCalledWith('wrongFundingAmount', { offerId: wronglyFundedSellOffer.id })
  })
})
