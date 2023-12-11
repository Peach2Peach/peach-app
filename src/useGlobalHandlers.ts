import { useEffect } from 'react'
import { useShouldShowBackupReminder } from './hooks'
import { useHandleNotifications } from './hooks/notifications/useHandleNotifications'
import { useMessageHandler } from './hooks/notifications/useMessageHandler'
import { useCheckFundingMultipleEscrows } from './hooks/useCheckFundingMultipleEscrows'
import { useDynamicLinks } from './hooks/useDynamicLinks'
import { useShowUpdateAvailable } from './hooks/useShowUpdateAvailable'
import { useInitialNavigation } from './init/useInitialNavigation'
import { useShowAnalyticsPopup } from './popups/useShowAnalyticsPopup'
import { useSettingsStore } from './store/settingsStore'

export const useGlobalHandlers = () => {
  const messageHandler = useMessageHandler()
  const showAnalyticsPrompt = useShowAnalyticsPopup()
  const analyticsPopupSeen = useSettingsStore((state) => state.analyticsPopupSeen)

  useShouldShowBackupReminder()
  useInitialNavigation()
  useShowUpdateAvailable()
  useDynamicLinks()
  useCheckFundingMultipleEscrows()
  useHandleNotifications(messageHandler)

  useEffect(() => {
    if (!useSettingsStore.persist?.hasHydrated()) return
    if (!analyticsPopupSeen) showAnalyticsPrompt()
  }, [analyticsPopupSeen, showAnalyticsPrompt])
}
