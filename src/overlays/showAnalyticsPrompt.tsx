import analytics from '@react-native-firebase/analytics'
import React from 'react'
import { updateSettings } from '../utils/account'
import i18n from '../utils/i18n'
import { AnalyticsPrompt } from './AnalyticsPrompt'

export const showAnalyticsPrompt = (updateOverlay: Function) => {
  const accept = () => {
    analytics().setAnalyticsCollectionEnabled(true)
    updateSettings(
      {
        enableAnalytics: true,
      },
      true,
    )
    updateOverlay({ visible: false })
  }

  const deny = () => {
    analytics().setAnalyticsCollectionEnabled(false)
    updateSettings(
      {
        enableAnalytics: false,
      },
      true,
    )
    updateOverlay({ visible: false })
  }

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
}
