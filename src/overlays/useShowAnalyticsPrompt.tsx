import analytics from '@react-native-firebase/analytics'
import React, { useCallback } from 'react'
import shallow from 'zustand/shallow'
import { useSettingsStore } from '../store/settingsStore'
import i18n from '../utils/i18n'
import { AnalyticsPrompt } from './AnalyticsPrompt'

export const useShowAnalyticsPrompt = (updateOverlay: React.Dispatch<OverlayState>) => {
  const [analyticsPopupSeen, setAnalyticsPopupSeen, setEnableAnalytics] = useSettingsStore(
    (state) => [state.analyticsPopupSeen, state.setAnalyticsPopupSeen, state.setEnableAnalytics],
    shallow,
  )

  const accept = useCallback(() => {
    analytics().setAnalyticsCollectionEnabled(true)
    setEnableAnalytics(true)
    setAnalyticsPopupSeen(true)
    updateOverlay({ visible: false })
  }, [setEnableAnalytics, setAnalyticsPopupSeen, updateOverlay])

  const deny = useCallback(() => {
    analytics().setAnalyticsCollectionEnabled(false)
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
  }, [accept, deny, analyticsPopupSeen, updateOverlay])
  return showAnalyticsPrompt
}
