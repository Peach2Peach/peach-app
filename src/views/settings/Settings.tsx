import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AppState, Linking, View } from 'react-native'
import analytics from '@react-native-firebase/analytics'

import tw from '../../styles/tailwind'

import { useFocusEffect } from '@react-navigation/native'
import { Headline, Icon, PeachScrollView, Text } from '../../components'
import { APPVERSION, BUILDNUMBER } from '../../constants'
import LanguageContext from '../../contexts/language'
import { OverlayContext } from '../../contexts/overlay'
import { DeleteAccount } from '../../overlays/DeleteAccount'
import { account, updateSettings } from '../../utils/account'
import i18n from '../../utils/i18n'
import { checkNotificationStatus, isProduction, toggleNotifications } from '../../utils/system'
import { SettingsItem } from './components/SettingsItem'
import { useNavigation } from '../../hooks'
import { useHeaderState } from '../../components/header/store'

export default (): ReactElement => {
  const navigation = useNavigation()
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const [notificationsOn, setNotificationsOn] = useState(false)
  const [analyticsOn, setAnalyticsOn] = useState(account.settings.enableAnalytics)

  const setHeaderState = useHeaderState((state) => state.setHeaderState)
  useEffect(() => {
    setHeaderState({ title: i18n('settings.title'), hideGoBackButton: true })
  }, [setHeaderState])

  const toggleAnalytics = () => {
    setAnalyticsOn(!account.settings.enableAnalytics)
    analytics().setAnalyticsCollectionEnabled(!account.settings.enableAnalytics)
    updateSettings({
      enableAnalytics: !account.settings.enableAnalytics,
    })
  }

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

  const goToContactUs = () => navigation.navigate('contact')
  const goToCurrencySettings = () => navigation.navigate('currency')
  const goToMyAccount = () => navigation.navigate('profile', { userId: account.publicKey })

  const deleteAccount = () => {
    updateOverlay({
      content: <DeleteAccount />,
      visible: true,
    })
  }
  const openPrivacyPolicy = () => Linking.openURL('https://www.peachbitcoin.com/privacyPolicy.html')
  const goToWebsite = () => Linking.openURL('https://peachbitcoin.com')

  type Setting = { title: string; onPress?: () => void; condition?: boolean; icon?: JSX.Element }

  const appSettings: Setting[] = useMemo(
    () => [
      { onPress: toggleNotifications, title: 'notifications', condition: notificationsOn },
      { onPress: goToCurrencySettings, title: 'displayCurrency' },
    ],
    [],
  )

  const accountSettings: Setting[] = useMemo(
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
      { title: 'escrow' },
      { title: 'paymentMethods' },
      { onPress: deleteAccount, title: 'deleteAccount' },
    ],
    [],
  )

  const aboutPeach: Setting[] = useMemo(
    () => [
      { title: 'fees' },
      { onPress: openPrivacyPolicy, title: 'privacyPolicy' },
      { title: 'socials' },
      {
        onPress: goToWebsite,
        title: 'website',
        icon: <Icon id="link" style={tw`w-3 h-3`} color={tw`text-grey-2`.color} />,
      },
      { onPress: toggleAnalytics, title: 'analytics', condition: analyticsOn },
    ],
    [],
  )

  return (
    <View style={tw`h-full pb-10`}>
      <PeachScrollView contentContainerStyle={tw`pt-6 px-12`}>
        {!isProduction() && <SettingsItem onPress={() => navigation.navigate('testView')} title="testView" />}
        <SettingsItem onPress={goToContactUs} title="contactUs" />

        <Headline style={tw`text-center text-lg text-peach-mild mt-8`}>{i18n('settings.appSettings')}</Headline>
        {appSettings.map((item, i) => (
          <SettingsItem key={`appSettings-${item.title}-${i}`} {...item} />
        ))}

        <Headline style={tw`text-center text-lg text-peach-mild mt-8`}>{i18n('settings.accountSettings')}</Headline>
        {accountSettings.map((item, i) => (
          <SettingsItem key={`accountSettings-${item.title}-${i}`} {...item} />
        ))}

        <Headline style={tw`text-center text-lg text-peach-mild mt-8`}>{i18n('settings.aboutPeach')}</Headline>
        {aboutPeach.map((item, i) => (
          <SettingsItem key={`aboutPeach-${item.title}-${i}`} {...item} />
        ))}

        <Text style={tw`text-center text-sm text-peach-mild mt-10`}>
          {i18n('settings.peachApp')}
          {APPVERSION} ({BUILDNUMBER})
        </Text>
      </PeachScrollView>
    </View>
  )
}
