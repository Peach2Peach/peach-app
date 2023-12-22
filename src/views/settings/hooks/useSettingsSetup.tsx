import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useMemo, useState } from 'react'
import { AppState } from 'react-native'
import { shallow } from 'zustand/shallow'
import { PopupAction } from '../../../components/popup'
import { WarningPopup } from '../../../popups/WarningPopup'
import { useShowAnalyticsPopup } from '../../../popups/useShowAnalyticsPopup'
import { useSettingsStore } from '../../../store/settingsStore'
import { usePopupStore } from '../../../store/usePopupStore'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { checkNotificationStatus } from '../../../utils/system/checkNotificationStatus'
import { isProduction } from '../../../utils/system/isProduction'
import { toggleNotifications } from '../../../utils/system/toggleNotifications'
import { isDefined } from '../../../utils/validation/isDefined'
import { NotificationPopup } from '../components/NotificationPopup'

const contactUs = isProduction()
  ? (['contact', 'aboutPeach'] as const)
  : (['testView', 'contact', 'aboutPeach'] as const)

export const useSettingsSetup = () => {
  const [setPopup, closePopup] = usePopupStore((state) => [state.setPopup, state.closePopup], shallow)
  const [notificationsOn, setNotificationsOn] = useState(false)
  const [enableAnalytics, toggleAnalytics, showBackupReminder] = useSettingsStore(
    (state) => [state.enableAnalytics, state.toggleAnalytics, state.showBackupReminder],
    shallow,
  )

  useFocusEffect(
    useCallback(() => {
      const checkingFunction = async () => {
        setNotificationsOn(await checkNotificationStatus())
      }
      const eventListener = AppState.addEventListener('change', checkingFunction)

      checkingFunction()

      return () => {
        eventListener.remove()
      }
    }, []),
  )

  const notificationClick = useCallback(() => {
    if (notificationsOn) {
      setPopup(
        <WarningPopup
          title={i18n('settings.notifications.popup.title')}
          content={<NotificationPopup />}
          actions={
            <>
              <PopupAction
                label={i18n('settings.notifications.popup.neverMind')}
                textStyle={tw`text-black-100`}
                iconId="arrowLeftCircle"
                onPress={closePopup}
              />
              <PopupAction
                label={i18n('settings.notifications.popup.yes')}
                textStyle={tw`text-black-100`}
                iconId="slash"
                onPress={() => {
                  closePopup()
                  toggleNotifications()
                }}
                reverseOrder
              />
            </>
          }
        />,
      )
    } else {
      toggleNotifications()
    }
  }, [closePopup, notificationsOn, setPopup])

  const profileSettings = useMemo(
    () =>
      [
        'myProfile',
        'referrals',
        {
          title: 'backups',
          iconId: showBackupReminder ? 'alertTriangle' : undefined,
          warning: !!showBackupReminder,
        },
        'networkFees',
        'transactionBatching',
        'paymentMethods',
      ] as const,
    [showBackupReminder],
  )

  const showAnalyticsPopup = useShowAnalyticsPopup()
  const onAnalyticsPress = useCallback(() => {
    if (!enableAnalytics) {
      showAnalyticsPopup()
    } else {
      toggleAnalytics()
    }
  }, [enableAnalytics, showAnalyticsPopup, toggleAnalytics])

  const appSettings = useMemo(
    () =>
      (
        [
          {
            title: 'analytics',
            onPress: onAnalyticsPress,
            iconId: enableAnalytics ? 'toggleRight' : 'toggleLeft',
            enabled: enableAnalytics,
          },
          {
            title: 'notifications',
            onPress: notificationClick,
          },
          'nodeSetup',
          'payoutAddress',
          'currency',
          'language',
        ] as const
      ).filter(isDefined),
    [onAnalyticsPress, enableAnalytics, notificationClick],
  )

  const settings = [
    { items: contactUs },
    { headline: 'profileSettings', items: profileSettings },
    { headline: 'appSettings', items: appSettings },
  ]

  return settings
}
