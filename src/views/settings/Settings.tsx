import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react'
import {
  AppState,
  Linking,
  Pressable,
  View
} from 'react-native'

import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import { Card, Headline, PeachScrollView, Text, Title } from '../../components'
import { APPVERSION } from '../../constants'
import i18n from '../../utils/i18n'
import { checkNotificationStatus, toggleNotifications } from '../../utils/system'
import { useFocusEffect } from '@react-navigation/native'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'settings'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

// eslint-disable-next-line max-lines-per-function
export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)

  const [notificationsOn, setNotificationsOn] = useState(false)

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
  const goToLanguageSettings = () => navigation.navigate('language', {})
  const goToCurrencySettings = () => navigation.navigate('currency', {})
  const goToMyAccount = () => navigation.navigate('myAccount', {})
  const goToBackups = () => navigation.navigate('backups', {})
  const goToPaymentMethods = () => navigation.navigate('paymentMethods', {})
  const goToDeleteAccount = () => navigation.navigate('deleteAccount', {})
  const gotoFees = () => navigation.navigate('fees', {})
  const goToSocials = () => navigation.navigate('socials', {})
  const goToWebsite = () => Linking.openURL('https://peachbitcoin.com')

  return <View style={tw`h-full pb-10`}>
    <PeachScrollView contentContainerStyle={tw`pt-6 px-6`}>
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
            <Text style={notificationsOn ? tw`text-peach-1 font-bold` : {}}> {i18n('settings.notifications.on')} </Text>
            /
            <Text style={notificationsOn ? {} : tw`text-peach-1 font-bold`}> {i18n('settings.notifications.off')}</Text>
          </Text>
        </Card>
      </Pressable>
      <Pressable style={tw`mt-2`} onPress={goToLanguageSettings}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.language')}</Text>
        </Card>
      </Pressable>
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
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.backups')}</Text>
        </Card>
      </Pressable>
      <Pressable style={tw`mt-2`} onPress={goToPaymentMethods}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.paymentMethods')}</Text>
        </Card>
      </Pressable>
      <Pressable style={tw`mt-2`} onPress={goToDeleteAccount}>
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
      <Pressable style={tw`mt-2`} onPress={goToSocials}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.socials')}</Text>
        </Card>
      </Pressable>
      <Pressable style={tw`mt-2`} onPress={goToWebsite}>
        <Card>
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.website')}</Text>
        </Card>
      </Pressable>

      <Text style={tw`text-center text-sm text-peach-mild mt-10`}>
        {i18n('settings.peachApp')}{APPVERSION}
      </Text>
    </PeachScrollView>
  </View>
}

