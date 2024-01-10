import { useSetPopup } from './components/popup/Popup'
import { useHandleNotifications } from './hooks/notifications/useHandleNotifications'
import { useMessageHandler } from './hooks/notifications/useMessageHandler'
import { useCheckFundingMultipleEscrows } from './hooks/useCheckFundingMultipleEscrows'
import { useDynamicLinks } from './hooks/useDynamicLinks'
import { useShouldShowBackupReminder } from './hooks/useShouldShowBackupReminder'
import { useShowUpdateAvailable } from './hooks/useShowUpdateAvailable'
import { useInitialNavigation } from './init/useInitialNavigation'
import { AnalyticsPopup } from './popups/AnalyticsPopup'
import { useSettingsStore } from './store/settingsStore/useSettingsStore'

export const useGlobalHandlers = () => {
  const messageHandler = useMessageHandler()
  const analyticsPopupSeen = useSettingsStore((state) => state.analyticsPopupSeen)

  useShouldShowBackupReminder()
  useInitialNavigation()
  useShowUpdateAvailable()
  useDynamicLinks()
  useCheckFundingMultipleEscrows()
  useHandleNotifications(messageHandler)

  const setPopup = useSetPopup()
  const setAnalyticsPopupSeen = useSettingsStore((state) => state.setAnalyticsPopupSeen)

  if (!analyticsPopupSeen && useSettingsStore.persist?.hasHydrated()) {
    setPopup(<AnalyticsPopup />)
    setAnalyticsPopupSeen(true)
  }
}
