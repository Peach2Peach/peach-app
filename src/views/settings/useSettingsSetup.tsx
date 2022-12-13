import React, { useCallback, useContext, useMemo, useState } from 'react'
import { AppState, Linking, Platform } from 'react-native'
import analytics from '@react-native-firebase/analytics'

import { useFocusEffect } from '@react-navigation/native'
import { OverlayContext } from '../../contexts/overlay'
import { DeleteAccount } from '../../overlays/DeleteAccount'
import { account, updateSettings } from '../../utils/account'
import i18n from '../../utils/i18n'
import { checkNotificationStatus, isProduction, toggleNotifications } from '../../utils/system'
import { useHeaderSetup, useNavigation } from '../../hooks'
import { SettingsItemProps } from './components/SettingsItem'

export const useSettingsSetup = () => {
  const navigation = useNavigation()
  useHeaderSetup(useMemo(() => ({ title: i18n('settings.title'), hideGoBackButton: true }), []))
  const [, updateOverlay] = useContext(OverlayContext)

  const [notificationsOn, setNotificationsOn] = useState(false)
  const [analyticsOn, setAnalyticsOn] = useState(account.settings.enableAnalytics)

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

  const toggleAnalytics = () => {
    setAnalyticsOn(!account.settings.enableAnalytics)
    analytics().setAnalyticsCollectionEnabled(!account.settings.enableAnalytics)
    updateSettings({
      enableAnalytics: !account.settings.enableAnalytics,
    })
  }
  const goToContactUs = useCallback(() => navigation.navigate('contact'), [navigation])
  const goToCurrencySettings = useCallback(() => navigation.navigate('currency'), [navigation])
  const goToMyAccount = useCallback(() => navigation.navigate('profile', { userId: account.publicKey }), [navigation])

  const deleteAccount = useCallback(() => {
    updateOverlay({
      content: <DeleteAccount />,
      visible: true,
    })
  }, [updateOverlay])
  const openPrivacyPolicy = () => Linking.openURL('https://www.peachbitcoin.com/privacyPolicy.html')
  const goToWebsite = () => Linking.openURL('https://peachbitcoin.com')

  const appSettings: SettingsItemProps[] = useMemo(
    () => [
      {
        title: 'notifications',
        onPress: toggleNotifications,
        enabled: notificationsOn,
        iconId: Platform.OS === 'android' ? (notificationsOn ? 'toggleRight' : 'toggleLeft') : undefined,
      },
      { title: 'displayCurrency', onPress: goToCurrencySettings },
    ],
    [goToCurrencySettings, notificationsOn],
  )

  const accountSettings: SettingsItemProps[] = useMemo(
    () => [
      { title: 'myAccount', onPress: goToMyAccount },
      {
        title: 'backups',
        iconId: account.settings.showBackupReminder ? 'alertTriangle' : undefined,
        warning: !!account.settings.showBackupReminder,
      },
      { title: 'referrals' },
      { title: 'escrow' },
      { title: 'paymentMethods' },
      { title: 'deleteAccount', onPress: deleteAccount },
    ],
    [deleteAccount, goToMyAccount],
  )

  const aboutPeach: SettingsItemProps[] = useMemo(
    () => [
      { title: 'fees' },
      { title: 'privacyPolicy', onPress: openPrivacyPolicy },
      { title: 'socials' },
      { title: 'website', onPress: goToWebsite },
      {
        title: 'analytics',
        onPress: toggleAnalytics,
        iconId: analyticsOn ? 'toggleRight' : 'toggleLeft',
        enabled: analyticsOn,
      },
    ],
    [analyticsOn],
  )

  const contactUs: SettingsItemProps[] = useMemo(() => {
    let arr: SettingsItemProps[] = [{ title: 'contactUs', onPress: goToContactUs }]
    if (!isProduction()) arr = [{ title: 'testView' }, ...arr]
    return arr
  }, [goToContactUs])

  const settings = [
    { items: contactUs },
    { headline: 'appSettings', items: appSettings },
    { headline: 'accountSettings', items: accountSettings },
    { headline: 'aboutPeach', items: aboutPeach },
  ]

  return settings
}
