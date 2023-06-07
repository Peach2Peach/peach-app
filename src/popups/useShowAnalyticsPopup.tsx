import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useSettingsStore } from '../store/settingsStore'
import { usePopupStore } from '../store/usePopupStore'
import i18n from '../utils/i18n'
import { AnalyticsPrompt } from './AnalyticsPrompt'

export const useShowAnalyticsPopup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const [setAnalyticsPopupSeen, setEnableAnalytics] = useSettingsStore(
    (state) => [state.setAnalyticsPopupSeen, state.setEnableAnalytics],
    shallow,
  )

  const accept = useCallback(() => {
    setEnableAnalytics(true)
    setAnalyticsPopupSeen(true)
    closePopup()
  }, [setEnableAnalytics, setAnalyticsPopupSeen, closePopup])

  const deny = useCallback(() => {
    setEnableAnalytics(false)
    setAnalyticsPopupSeen(true)
    closePopup()
  }, [setEnableAnalytics, setAnalyticsPopupSeen, closePopup])

  const showAnalyticsPrompt = useCallback(() => {
    setPopup({
      title: i18n('analytics.request.title'),
      content: <AnalyticsPrompt />,
      visible: true,
      action1: {
        callback: accept,
        label: i18n('analytics.request.yes'),
        icon: 'checkSquare',
      },
      action2: {
        callback: deny,
        label: i18n('analytics.request.no'),
        icon: 'xSquare',
      },
      level: 'APP',
    })
  }, [accept, deny, setPopup])

  return showAnalyticsPrompt
}
