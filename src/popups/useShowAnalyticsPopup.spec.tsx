import { renderHook } from 'test-utils'
import { useSettingsStore } from '../store/settingsStore'
import { defaultPopupState, usePopupStore } from '../store/usePopupStore'
import { AnalyticsPrompt } from './AnalyticsPrompt'
import { useShowAnalyticsPopup } from './useShowAnalyticsPopup'

describe('useShowAnalyticsPopup', () => {
  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
    useSettingsStore.getState().reset()
  })

  it('opens analytics popup', () => {
    const { result } = renderHook(useShowAnalyticsPopup)
    result.current()

    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      title: 'share usage data?',
      content: <AnalyticsPrompt />,
      visible: true,
      level: 'APP',
      action1: {
        label: 'sure',
        icon: 'checkSquare',
        callback: expect.any(Function),
      },
      action2: {
        callback: expect.any(Function),
        icon: 'xSquare',
        label: 'no, thanks',
      },
    })
  })
  it('enables analytics', () => {
    const { result } = renderHook(useShowAnalyticsPopup)
    result.current()

    usePopupStore.getState().action1?.callback()
    expect(usePopupStore.getState().visible).toEqual(false)
    expect(useSettingsStore.getState().analyticsPopupSeen).toEqual(true)
    expect(useSettingsStore.getState().enableAnalytics).toEqual(true)
  })
  it('rejects analytics', () => {
    const { result } = renderHook(useShowAnalyticsPopup)
    result.current()

    usePopupStore.getState().action2?.callback()
    expect(usePopupStore.getState().visible).toEqual(false)
    expect(useSettingsStore.getState().analyticsPopupSeen).toEqual(true)
    expect(useSettingsStore.getState().enableAnalytics).toEqual(false)
  })
})
