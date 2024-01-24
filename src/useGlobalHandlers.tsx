import { setUnhandledPromiseRejectionTracker } from 'react-native-promise-rejection-utils'
import { useSetPopup } from './components/popup/Popup'
import { useSetToast } from './components/toast/Toast'
import { useHandleNotifications } from './hooks/notifications/useHandleNotifications'
import { useMessageHandler } from './hooks/notifications/useMessageHandler'
import { useCheckFundingMultipleEscrows } from './hooks/useCheckFundingMultipleEscrows'
import { useDynamicLinks } from './hooks/useDynamicLinks'
import { useNavigation } from './hooks/useNavigation'
import { useShouldShowBackupReminder } from './hooks/useShouldShowBackupReminder'
import { useShowUpdateAvailable } from './hooks/useShowUpdateAvailable'
import { useSyncUserAccount } from './hooks/user/useSyncUserAccount'
import { useInitialNavigation } from './init/useInitialNavigation'
import { AnalyticsPopup } from './popups/AnalyticsPopup'
import { VerifyYouAreAHumanPopup } from './popups/warning/VerifyYouAreAHumanPopup'
import { useSettingsStore } from './store/settingsStore/useSettingsStore'
import i18n from './utils/i18n'
import { error } from './utils/log/error'
import { parseError } from './utils/result/parseError'
import { isNetworkError } from './utils/system/isNetworkError'

export const useGlobalHandlers = () => {
  const messageHandler = useMessageHandler()
  const analyticsPopupSeen = useSettingsStore((state) => state.analyticsPopupSeen)

  useShouldShowBackupReminder()
  useInitialNavigation()
  useShowUpdateAvailable()
  useSyncUserAccount()
  useDynamicLinks()
  useCheckFundingMultipleEscrows()
  useHandleNotifications(messageHandler)

  const setPopup = useSetPopup()
  const setAnalyticsPopupSeen = useSettingsStore((state) => state.setAnalyticsPopupSeen)
  const setToast = useSetToast()
  const navigation = useNavigation()

  ErrorUtils.setGlobalHandler((err: Error) => {
    error(err)
    setToast({
      msgKey: err.message || 'GENERAL_ERROR',
      color: 'red',
      action: {
        onPress: () => navigation.navigate('contact'),
        label: i18n('contactUs'),
        iconId: 'mail',
      },
    })
  })

  setUnhandledPromiseRejectionTracker((id, err) => {
    error(err)
    const errorMessage = parseError(err)

    if (errorMessage === 'HUMAN_VERIFICATION_REQUIRED') {
      setPopup(<VerifyYouAreAHumanPopup />)
      return
    }
    const errorMsgKey = isNetworkError(errorMessage) ? 'NETWORK_ERROR' : errorMessage
    setToast({
      msgKey: errorMsgKey || 'GENERAL_ERROR',
      color: 'red',
      action: {
        onPress: () => navigation.navigate('contact'),
        label: i18n('contactUs'),
        iconId: 'mail',
      },
    })
  })

  if (!analyticsPopupSeen && useSettingsStore.persist?.hasHydrated()) {
    setPopup(<AnalyticsPopup />)
    setAnalyticsPopupSeen(true)
  }
}
