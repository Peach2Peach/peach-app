/* eslint-disable max-lines-per-function, max-len */
import React, { ReactElement, useContext, useState } from 'react'
import {
  Linking,
  Pressable,
  View
} from 'react-native'
import { getUniqueId } from 'react-native-device-info'

import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'

import LanguageContext from '../../contexts/language'
import { Button, Card, Fade, Headline, PeachScrollView, Text, Title } from '../../components'
import { account, backupAccount, deleteAccount } from '../../utils/account'
import { API_URL, NETWORK } from '@env'
import { APPVERSION } from '../../constants'
import Clipboard from '@react-native-clipboard/clipboard'
import i18n from '../../utils/i18n'
import Icon from '../../components/Icon'
import { splitAt } from '../../utils/string'


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'settings'>

type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [showCopied, setShowCopied] = useState(false)

  const publicKey = splitAt(account.publicKey, Math.floor(account.publicKey.length / 2) - 1).join('\n')
  const copy = () => {
    Clipboard.setString(account.publicKey)
    setShowCopied(true)
    setTimeout(() => setShowCopied(false), 500)
  }

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

  const toggleNotifications = () => {} // TODO

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
          <Text style={tw`text-center text-lg text-black-1 p-2`}>{i18n('settings.notifications')}</Text>
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

