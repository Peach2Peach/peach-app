import { act, fireEvent, render, renderHook } from 'test-utils'
import { navigateMock } from '../../tests/unit/helpers/NavigationWrapper'
import { Popup, PopupAction } from '../components/popup'
import { PopupComponent } from '../components/popup/PopupComponent'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { BuyOfferExpired } from './BuyOfferExpired'
import { ClosePopupAction } from './actions'
import { useBuyOfferExpiredPopup } from './useBuyOfferExpiredPopup'

describe('useBuyOfferExpiredPopup', () => {
  const offerId = '37'
  const days = '30'
  beforeEach(() => {
    usePopupStore.setState(defaultPopupState)
  })

  it('opens BuyOfferExpired popup', () => {
    const { result } = renderHook(useBuyOfferExpiredPopup)
    act(() => {
      result.current(offerId, days)
    })

    expect(usePopupStore.getState().visible).toBeTruthy()
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <PopupComponent
        title="Buy offer removed"
        content={<BuyOfferExpired {...{ offerId, days }} />}
        actions={
          <>
            <PopupAction label="help" iconId="helpCircle" onPress={expect.any(Function)} />
            <ClosePopupAction reverseOrder />
          </>
        }
      />,
    )
  })
  it('closes popup', () => {
    const { result } = renderHook(useBuyOfferExpiredPopup)
    act(() => {
      result.current(offerId, days)
    })
    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('close'))

    expect(usePopupStore.getState().visible).toBeFalsy()
  })
  it('navigates to contact', () => {
    const { result } = renderHook(useBuyOfferExpiredPopup)
    act(() => {
      result.current(offerId, days)
    })
    const { getByText } = render(<Popup />)
    fireEvent.press(getByText('help'))

    expect(usePopupStore.getState().visible).toBeFalsy()
    expect(navigateMock).toHaveBeenCalledWith('contact')
  })
})
