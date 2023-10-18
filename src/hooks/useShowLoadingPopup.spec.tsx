import { renderHook } from 'test-utils'
import { PopupLoadingSpinner } from '../../tests/unit/helpers/PopupLoadingSpinner'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { useShowLoadingPopup } from './useShowLoadingPopup'

describe('useShowLoadingPopup', () => {
  it('returns function to show loading popup', () => {
    const { result } = renderHook(useShowLoadingPopup)
    expect(result.current).toBeInstanceOf(Function)
  })
  it('opens default popup with loading animation', () => {
    const { result } = renderHook(useShowLoadingPopup)
    result.current()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: { callback: expect.any(Function), icon: 'clock', label: i18n('loading') },
      content: PopupLoadingSpinner,
      level: 'APP',
      requireUserAction: true,
      title: i18n('loading'),
      visible: true,
    })
  })
  it('action callback does not close popup', () => {
    const { result } = renderHook(useShowLoadingPopup)
    result.current()
    usePopupStore.getState().action1?.callback()
    expect(usePopupStore.getState().visible).toEqual(true)
  })
  it('respects passed options', () => {
    const title = 'title'
    const level = 'WARN'
    const { result } = renderHook(useShowLoadingPopup)
    result.current({
      title,
      level,
    })
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      action1: { callback: expect.any(Function), icon: 'clock', label: i18n('loading') },
      content: PopupLoadingSpinner,
      level,
      requireUserAction: true,
      title,
      visible: true,
    })
  })
})
