import { fireEvent, render, renderHook } from 'test-utils'
import { useSettingsStore } from '../store/settingsStore'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { useShowAnalyticsPopup } from './useShowAnalyticsPopup'

describe('useShowAnalyticsPopup', () => {
  beforeEach(() => {
    usePopupStore.setState(defaultPopupState)
    useSettingsStore.getState().reset()
  })

  it('opens analytics popup', () => {
    const { result } = renderHook(useShowAnalyticsPopup)
    result.current()

    const popupComponent = usePopupStore.getState().popupComponent || <></>
    expect(render(popupComponent)).toMatchSnapshot()
    expect(useSettingsStore.getState().analyticsPopupSeen).toEqual(true)
  })
  it('enables analytics', () => {
    const { result } = renderHook(useShowAnalyticsPopup)
    result.current()

    const popupComponent = usePopupStore.getState().popupComponent || <></>

    const { getByText } = render(popupComponent)
    fireEvent.press(getByText('sure'))

    expect(usePopupStore.getState().visible).toEqual(false)
    expect(useSettingsStore.getState().enableAnalytics).toEqual(true)
  })
  it('rejects analytics', () => {
    const { result } = renderHook(useShowAnalyticsPopup)
    result.current()

    const popupComponent = usePopupStore.getState().popupComponent || <></>

    const { getByText } = render(popupComponent)
    fireEvent.press(getByText('no, thanks'))

    expect(usePopupStore.getState().visible).toEqual(false)
    expect(useSettingsStore.getState().enableAnalytics).toEqual(false)
  })
})
