import { renderHook } from '@testing-library/react-native'
import { useShowAppPopup } from './useShowAppPopup'
import { usePopupStore } from '../store/usePopupStore'
import { OfferTaken } from '../overlays/app/OfferTaken'
import { MatchUndone } from '../overlays/app/MatchUndone'

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
