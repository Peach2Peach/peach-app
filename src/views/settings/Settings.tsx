import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import {
  AppState,
  Linking,
  Pressable,
  View
} from 'react-native'
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
import { checkNotificationStatus, toggleNotifications } from '../../utils/system'

type Props = {
  navigation: StackNavigation
}

// eslint-disable-next-line max-lines-per-function
export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [, updateOverlay] = useContext(OverlayContext)

  const [notificationsOn, setNotificationsOn] = useState(false)
  const [analyticsOn, setAnalyticsOn] = useState(account.settings.enableAnalytics)

  const toggleAnalytics = () => {
    setAnalyticsOn(!account.settings.enableAnalytics)
    updateSettings({
      enableAnalytics: !account.settings.enableAnalytics
    })
    analytics().setAnalyticsCollectionEnabled(!account.settings.enableAnalytics)

  }
  useEffect(() => {
    (async () => {
      setNotificationsOn(await checkNotificationStatus())
    })()
  })

  useFocusEffect(useCallback(() => {
    const checkingFunction = async () => {
      setNotificationsOn(await checkNotificationStatus())
    }
    const eventListener = AppState.addEventListener('change', checkingFunction)

    checkingFunction()

    return () => {
      eventListener.remove()
    }
  }, []))

  const goToContactUs = () => navigation.navigate('contact', {})
  // const goToLanguageSettings = () => navigation.navigate('language', {})
  const goToCurrencySettings = () => navigation.navigate('currency', {})
  const goToMyAccount = () => navigation.navigate('profile', { userId: account.publicKey })
  const goToBackups = () => navigation.navigate('backups', {})
  const goToReferrals = () => navigation.navigate('referrals', {})
  const goToEscrow = () => navigation.navigate('escrow', {})
  const goToPaymentMethods = () => navigation.navigate('paymentMethods', {})
  const deleteAccount = () => {
    updateOverlay({
      content: <DeleteAccount navigate={() => navigation.replace('welcome', {})}/>,
      showCloseButton: false
    })
  }
  const gotoFees = () => navigation.navigate('fees', {})
  const goToSocials = () => navigation.navigate('socials', {})
  const openPrivacyPolicy = () => Linking.openURL('https://www.peachbitcoin.com/privacy-policy/')
  const goToWebsite = () => Linking.openURL('https://peachbitcoin.com')

  return <View style={tw`h-full pb-10`}>
    <PeachScrollView contentContainerStyle={tw`pt-6 px-12`}>
      <Title title={i18n('settings.title')} />
      <Pressable style={tw`mt-20`} onPress={goToContactUs}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.contactUs')}</Text>
        </Card>
      </Pressable>

      <Headline style={tw`text-center text-lg text-peach-mild mt-8`}>
        {i18n('settings.appSettings')}
      </Headline>
      <Pressable style={tw`mt-2`} onPress={toggleNotifications}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>
            {i18n('settings.notifications')}
            <Text style={notificationsOn ? tw`text-peach-1 font-bold` : {}}> {i18n('settings.on')} </Text>
            /
            <Text style={notificationsOn ? {} : tw`text-peach-1 font-bold`}> {i18n('settings.off')}</Text>
          </Text>
        </Card>
      </Pressable>
      {/* <Pressable style={tw`mt-2`} onPress={goToLanguageSettings}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.language')}</Text>
        </Card>
      </Pressable> */}
      <Pressable style={tw`mt-2`} onPress={goToCurrencySettings}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.displayCurrency')}</Text>
        </Card>
      </Pressable>

      <Headline style={tw`text-center text-lg text-peach-mild mt-8`}>
        {i18n('settings.accountSettings')}
      </Headline>
      <Pressable style={tw`mt-2`} onPress={goToMyAccount}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.myAccount')}</Text>
        </Card>
      </Pressable>
      <Pressable style={tw`mt-2`} onPress={goToBackups}>
        <Card style={account.settings.showBackupReminder !== false ? tw`bg-yellow-1` : {}}>
          <Text style={tw`w-full flex-shrink text-center text-lg text-black-1 p-2`}>{i18n('settings.backups')}</Text>
          {account.settings.showBackupReminder !== false
            ? <View style={tw`absolute right-3 h-full flex justify-center`}>
              <Icon id="warning" style={tw`w-6 h-6`} color={tw`text-white-1`.color as string}/>
            </View>
            : null
          }
        </Card>
      </Pressable>
      <Pressable style={tw`mt-2`} onPress={goToReferrals}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.referrals')}</Text>
        </Card>
      </Pressable>
      <Pressable style={tw`mt-2`} onPress={goToEscrow}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.escrow')}</Text>
        </Card>
      </Pressable>
      <Pressable style={tw`mt-2`} onPress={goToPaymentMethods}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.paymentMethods')}</Text>
        </Card>
      </Pressable>
      <Pressable style={tw`mt-2`} onPress={deleteAccount}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.deleteAccount')}</Text>
        </Card>
      </Pressable>

      <Headline style={tw`text-center text-lg text-peach-mild mt-8`}>
        {i18n('settings.aboutPeach')}
      </Headline>
      <Pressable style={tw`mt-2`} onPress={gotoFees}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.fees')}</Text>
        </Card>
      </Pressable>
      <Pressable style={tw`mt-2`} onPress={openPrivacyPolicy}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('privacyPolicy')}</Text>
        </Card>
      </Pressable>
      <Pressable style={tw`mt-2`} onPress={goToSocials}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.socials')}</Text>
        </Card>
      </Pressable>
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
            <Text style={analyticsOn ? tw`text-peach-1 font-bold` : {}}> {i18n('settings.on')} </Text>
            /
            <Text style={analyticsOn ? {} : tw`text-peach-1 font-bold`}> {i18n('settings.off')}</Text>
          </Text>
        </Card>
      </Pressable>

      <Text style={tw`text-center text-sm text-peach-mild mt-10`}>
        {i18n('settings.peachApp')}{APPVERSION} ({BUILDNUMBER})
      </Text>
    </PeachScrollView>
  </View>
}

