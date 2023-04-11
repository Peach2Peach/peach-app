import { useCallback, Dispatch } from 'react'
import { shallow } from 'zustand/shallow'
import { useSettingsStore } from '../store/settingsStore'
import i18n from '../utils/i18n'
import { AnalyticsPrompt } from './AnalyticsPrompt'

export const useShowAnalyticsPrompt = (updateOverlay: Dispatch<OverlayState>) => {
  const [setAnalyticsPopupSeen, setEnableAnalytics] = useSettingsStore(
    (state) => [state.setAnalyticsPopupSeen, state.setEnableAnalytics],
    shallow,
  )

  const accept = useCallback(() => {
    setEnableAnalytics(true)
    setAnalyticsPopupSeen(true)
    updateOverlay({ visible: false })
  }, [setEnableAnalytics, setAnalyticsPopupSeen, updateOverlay])

  const deny = useCallback(() => {
    setEnableAnalytics(false)
    setAnalyticsPopupSeen(true)
    updateOverlay({ visible: false })
  }, [setEnableAnalytics, setAnalyticsPopupSeen, updateOverlay])

  const showAnalyticsPrompt = useCallback(() => {
    updateOverlay({
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
  }, [accept, deny, updateOverlay])
  return showAnalyticsPrompt
}
