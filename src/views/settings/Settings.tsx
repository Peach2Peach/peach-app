import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import { AppState, Linking, Pressable, View } from 'react-native'
import analytics from '@react-native-firebase/analytics'

import tw from '../../styles/tailwind'

import { useFocusEffect } from '@react-navigation/native'
import { Card, Headline, Icon, PeachScrollView, Text, Title } from '../../components'
import { APPVERSION, BUILDNUMBER } from '../../constants'
import LanguageContext from '../../contexts/language'
import { OverlayContext } from '../../contexts/overlay'
import { DeleteAccount } from '../../overlays/DeleteAccount'
import { account, updateSettings } from '../../utils/account'
import i18n from '../../utils/i18n'
import { StackNavigation } from '../../utils/navigation'
import { checkNotificationStatus, isProduction, toggleNotifications } from '../../utils/system'
import SettingsItem from './components/SettingsItem'

type Props = {
  navigation: StackNavigation
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const [notificationsOn, setNotificationsOn] = useState(false)
  const [analyticsOn, setAnalyticsOn] = useState(account.settings.enableAnalytics)

  const toggleAnalytics = () => {
    setAnalyticsOn(!account.settings.enableAnalytics)
    analytics().setAnalyticsCollectionEnabled(!account.settings.enableAnalytics)
    updateSettings({
      enableAnalytics: !account.settings.enableAnalytics,
    })
  }
  useEffect(() => {
    ;(async () => {
      setNotificationsOn(await checkNotificationStatus())
    })()
  })

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

  const goToContactUs = () => navigation.navigate('contact', {})
  // const goToLanguageSettings = () => navigation.navigate('language', {})
  const goToCurrencySettings = () => navigation.navigate('currency', {})
  const goToMyAccount = () => navigation.navigate('profile', { userId: account.publicKey })
  const goToBackups = () => navigation.navigate('backups', {})
  const goToReferrals = () => navigation.navigate('referrals', {})
  const goToEscrow = () => navigation.navigate('escrow', {})
  const goToPaymentMethods = () => navigation.navigate('paymentMethods', {})
  const resetNav = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'welcome' }],
    })
  }
  const deleteAccount = () => {
    updateOverlay({
      content: <DeleteAccount navigate={resetNav} />,
      showCloseIcon: true,
    })
  }
  const gotoFees = () => navigation.navigate('fees', {})
  const goToSocials = () => navigation.navigate('socials', {})
  const openPrivacyPolicy = () => Linking.openURL('https://www.peachbitcoin.com/privacyPolicy.html')
  const goToWebsite = () => Linking.openURL('https://peachbitcoin.com')

  return (
    <View style={tw`h-full pb-10`}>
      <PeachScrollView contentContainerStyle={tw`pt-6 px-12`}>
        <Title title={i18n('settings.title')} />
        {!isProduction() && <SettingsItem onPress={() => navigation.navigate('testView')} title="testView" />}
        <SettingsItem onPress={goToContactUs} title="contactUs" />

        <Headline style={tw`text-center text-lg text-peach-mild mt-8`}>{i18n('settings.appSettings')}</Headline>
        <Pressable style={tw`mt-2`} onPress={toggleNotifications}>
          <Card>
            <Text style={tw`text-center text-lg text-black-1 p-2`}>
              {i18n('settings.notifications')}
              <Text style={notificationsOn ? tw`text-peach-1 font-bold` : {}}> {i18n('settings.on')} </Text>/
              <Text style={notificationsOn ? {} : tw`text-peach-1 font-bold`}> {i18n('settings.off')}</Text>
            </Text>
          </Card>
        </Pressable>
        {/* <SettingsItem onPress={goToLanguageSettings} title="language" /> */}
        <SettingsItem onPress={goToCurrencySettings} title="displayCurrency" />

        <Headline style={tw`text-center text-lg text-peach-mild mt-8`}>{i18n('settings.accountSettings')}</Headline>
        <SettingsItem onPress={goToMyAccount} title="myAccount" />
        <Pressable style={tw`mt-2`} onPress={goToBackups}>
          <Card style={account.settings.showBackupReminder !== false ? tw`bg-yellow-1` : {}}>
            <Text style={tw`w-full flex-shrink text-center text-lg text-black-1 p-2`}>{i18n('settings.backups')}</Text>
            {account.settings.showBackupReminder !== false ? (
              <View style={tw`absolute right-3 h-full flex justify-center`}>
                <Icon id="warning" style={tw`w-6 h-6`} color={tw`text-white-1`.color as string} />
              </View>
            ) : null}
          </Card>
        </Pressable>
        <SettingsItem onPress={goToReferrals} title="referrals" />
        <SettingsItem onPress={goToEscrow} title="escrow" />
        <SettingsItem onPress={goToPaymentMethods} title="paymentMethods" />
        <SettingsItem onPress={deleteAccount} title="deleteAccount" />

        <Headline style={tw`text-center text-lg text-peach-mild mt-8`}>{i18n('settings.aboutPeach')}</Headline>
        <SettingsItem onPress={gotoFees} title="fees" />
        <SettingsItem onPress={openPrivacyPolicy} title="privacyPolicy" />
        <SettingsItem onPress={goToSocials} title="socials" />
        <Pressable style={tw`mt-2`} onPress={goToWebsite}>
          <Card style={tw`flex-row items-center justify-center`}>
            <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.website')}</Text>
            <Icon id="link" style={tw`w-3 h-3`} color={tw`text-grey-2`.color as string} />
          </Card>
        </Pressable>
        <Pressable style={tw`mt-2`} onPress={toggleAnalytics}>
          <Card>
            <Text style={tw`text-center text-lg text-black-1 p-2`}>
              {i18n('settings.analytics')}
              <Text style={analyticsOn ? tw`text-peach-1 font-bold` : {}}> {i18n('settings.on')} </Text>/
              <Text style={analyticsOn ? {} : tw`text-peach-1 font-bold`}> {i18n('settings.off')}</Text>
            </Text>
          </Card>
        </Pressable>

        <Text style={tw`text-center text-sm text-peach-mild mt-10`}>
          {i18n('settings.peachApp')}
          {APPVERSION} ({BUILDNUMBER})
        </Text>
      </PeachScrollView>
    </View>
  )
}
