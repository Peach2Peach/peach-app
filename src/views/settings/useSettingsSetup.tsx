import React, { useCallback, useContext, useMemo, useState } from 'react'
import { AppState, Linking } from 'react-native'
import analytics from '@react-native-firebase/analytics'

import tw from '../../styles/tailwind'

import { useFocusEffect } from '@react-navigation/native'
import { Icon } from '../../components'
import { OverlayContext } from '../../contexts/overlay'
import { DeleteAccount } from '../../overlays/DeleteAccount'
import { account, updateSettings } from '../../utils/account'
import i18n from '../../utils/i18n'
import { checkNotificationStatus, isProduction, toggleNotifications } from '../../utils/system'
import { useHeaderSetup, useNavigation } from '../../hooks'

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

  const appSettings = useMemo(
    () => [
      { title: 'notifications', onPress: toggleNotifications, condition: notificationsOn },
      { title: 'displayCurrency', onPress: goToCurrencySettings },
    ],
    [goToCurrencySettings, notificationsOn],
  )

  const accountSettings = useMemo(
    () => [
      { title: 'myAccount', onPress: goToMyAccount },
      {
        title: 'backups',
        icon: account.settings.showBackupReminder ? (
          <Icon
            id="alertTriangle"
            style={tw`w-6 h-6 absolute right-3 h-full flex justify-center`}
            color={tw`text-white-1`.color}
          />
        ) : undefined,
      },
      { title: 'referrals' },
      { title: 'refundAddress' },
      { title: 'paymentMethods' },
      { title: 'deleteAccount', onPress: deleteAccount },
    ],
    [deleteAccount, goToMyAccount],
  )

  const aboutPeach = useMemo(
    () => [
      { title: 'fees' },
      { title: 'privacyPolicy', onPress: openPrivacyPolicy },
      { title: 'socials' },
      {
        title: 'website',
        onPress: goToWebsite,
        icon: <Icon id="link" style={tw`w-3 h-3`} color={tw`text-grey-2`.color} />,
      },
      { title: 'analytics', onPress: toggleAnalytics, condition: analyticsOn },
    ],
    [analyticsOn],
  )

  const contactUs = useMemo(() => {
    let arr: { title: string; onPress?: () => void }[] = [{ title: 'contactUs', onPress: goToContactUs }]
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
