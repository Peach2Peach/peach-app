import { act, fireEvent, render, renderHook } from 'test-utils'
import { navigateMock } from '../../tests/unit/helpers/NavigationWrapper'
import { Popup, PopupAction } from '../components/popup'
import { PopupComponent } from '../components/popup/PopupComponent'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { OfferOutsideRange } from './OfferOutsideRange'
import { ClosePopupAction } from './actions'
import { useOfferOutsideRangePopup } from './useOfferOutsideRangePopup'

describe('useOfferOutsideRangePopup', () => {
  const offerId = '37'
  beforeEach(() => {
    usePopupStore.setState(defaultPopupState)
  })

  it('opens BuyOfferExpired popup', () => {
    const { result } = renderHook(useOfferOutsideRangePopup)
    act(() => {
      result.current(offerId)
    })

    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <PopupComponent
        title="bitcoin pumped!"
        content={<OfferOutsideRange {...{ offerId }} />}
        actions={
          <>
            <ClosePopupAction />
            <PopupAction label="go to offer" iconId="arrowLeftCircle" onPress={expect.any(Function)} reverseOrder />
          </>
        }
      />,
    )
  })
  it('closes popup', () => {
    const { result } = renderHook(useOfferOutsideRangePopup)
    act(() => {
      result.current(offerId)
    })
    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('close'))

    expect(usePopupStore.getState().visible).toBeFalsy()
  })
  it('navigates to offer', () => {
    const { result } = renderHook(useOfferOutsideRangePopup)
    act(() => {
      result.current(offerId)
    })
    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('go to offer'))

    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(navigateMock).toHaveBeenCalledWith('offer', { offerId })
  })
})
