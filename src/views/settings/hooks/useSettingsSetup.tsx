import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useMemo, useState } from 'react'
import { AppState } from 'react-native'
import { shallow } from 'zustand/shallow'
import { useSettingsStore } from '../../../store/settingsStore'
import { usePopupStore } from '../../../store/usePopupStore'
import i18n from '../../../utils/i18n'
import { checkNotificationStatus, isProduction, toggleNotifications } from '../../../utils/system'
import { isDefined } from '../../../utils/validation'
import { NotificationPopup } from '../components/NotificationPopup'
import { SettingsItemProps } from '../components/SettingsItem'

const contactUs = (() => {
  let arr: SettingsItemProps[] = [{ title: 'contact' }, { title: 'aboutPeach' }]
  if (!isProduction()) arr = [{ title: 'testView' }, ...arr]
  return arr
})()

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
      setPopup({
        title: i18n('settings.notifications.popup.title'),
        content: <NotificationPopup />,
        visible: true,
        level: 'WARN',
        action2: {
          callback: closePopup,
          label: i18n('settings.notifications.popup.neverMind'),
          icon: 'arrowLeftCircle',
        },
        action1: {
          callback: () => {
            closePopup()
            toggleNotifications()
          },
          label: i18n('settings.notifications.popup.yes'),
          icon: 'slash',
        },
      })
    } else {
      toggleNotifications()
    }
  }, [closePopup, notificationsOn, setPopup])

  const profileSettings: SettingsItemProps[] = useMemo(
    () => [
      { title: 'myProfile' },
      { title: 'referrals' },
      {
        title: 'backups',
        iconId: showBackupReminder ? 'alertTriangle' : undefined,
        warning: !!showBackupReminder,
      },
      { title: 'networkFees' },
      { title: 'transactionBatching' },
      { title: 'paymentMethods' },
    ],
    [showBackupReminder],
  )

  const appSettings: SettingsItemProps[] = useMemo(
    () =>
      (
        [
          {
            title: 'analytics',
            onPress: toggleAnalytics,
            iconId: enableAnalytics ? 'toggleRight' : 'toggleLeft',
            enabled: enableAnalytics,
          },
          {
            title: 'notifications',
            onPress: notificationClick,
          },
          { title: 'nodeSetup' },
          { title: 'payoutAddress' },
          { title: 'currency' },
          { title: 'language' },
        ] satisfies (SettingsItemProps | undefined)[]
      ).filter(isDefined),
    [toggleAnalytics, enableAnalytics, notificationClick],
  )

  const settings = [
    { items: contactUs },
    { headline: 'profileSettings', items: profileSettings },
    { headline: 'appSettings', items: appSettings },
  ]

  return settings
}
