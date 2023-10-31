import { renderHook } from 'test-utils'
import { MatchUndone } from '../popups/app/MatchUndone'
import { OfferTaken } from '../popups/app/OfferTaken'
import { usePopupStore } from '../store/usePopupStore'
import { useShowAppPopup } from './useShowAppPopup'

describe('useShowAppPopup', () => {
  it('open offerTaken popup', () => {
    const { result } = renderHook(useShowAppPopup, { initialProps: 'offerTaken' })
    result.current()
    expect(usePopupStore.getState()).toStrictEqual({
      ...usePopupStore.getState(),
      title: 'offer taken...',
      content: <OfferTaken />,
      level: 'APP',
      visible: true,
    })
  })
  it('open matchUndone popup', () => {
    const { result } = renderHook(useShowAppPopup, { initialProps: 'matchUndone' })
    result.current()
    expect(usePopupStore.getState()).toStrictEqual({
      ...usePopupStore.getState(),
      title: 'match undone',
      content: <MatchUndone />,
      level: 'APP',
      visible: true,
    })
  })
})
