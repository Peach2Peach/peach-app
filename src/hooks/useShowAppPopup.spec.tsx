import { renderHook } from 'test-utils'
import { PopupComponent } from '../components/popup/PopupComponent'
import { ClosePopupAction } from '../popups/actions/ClosePopupAction'
import { MatchUndone } from '../popups/app/MatchUndone'
import { OfferTaken } from '../popups/app/OfferTaken'
import { usePopupStore } from '../store/usePopupStore'
import { useShowAppPopup } from './useShowAppPopup'

describe('useShowAppPopup', () => {
  it('open offerTaken popup', () => {
    const { result } = renderHook(useShowAppPopup, { initialProps: 'offerTaken' })
    result.current()
    expect(usePopupStore.getState().visible).toBe(true)
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <PopupComponent
        title="offer taken..."
        content={<OfferTaken />}
        actions={<ClosePopupAction style={{ justifyContent: 'center' }} />}
      />,
    )
  })
  it('open matchUndone popup', () => {
    const { result } = renderHook(useShowAppPopup, { initialProps: 'matchUndone' })
    result.current()
    expect(usePopupStore.getState().visible).toBe(true)
    expect(usePopupStore.getState().popupComponent).toStrictEqual(
      <PopupComponent
        title="match undone"
        content={<MatchUndone />}
        actions={<ClosePopupAction style={{ justifyContent: 'center' }} />}
      />,
    )
  })
})
