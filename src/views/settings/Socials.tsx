import React, { ReactElement, useContext } from 'react'
import { Linking, View } from 'react-native'

import tw from '../../styles/tailwind'

import { GoBackButton, Title } from '../../components'
import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'
import SocialsItem from './components/SocialsItem'

export default (): ReactElement => {
  useContext(LanguageContext)

  const goToTwitter = () => Linking.openURL('https://twitter.com/peachbitcoin')
  const goToInstagram = () => Linking.openURL('https://www.instagram.com/peachbitcoin')
  const goToTelegram = () => Linking.openURL('https://t.me/+3KpdrMw25xBhNGJk')
  const goToDiscord = () => Linking.openURL('https://discord.gg/skP9zqTB')

  return (
    <View style={tw`h-full pb-10 pt-6 px-12`}>
      <Title title={i18n('settings.title')} subtitle={i18n('settings.socials.subtitle')} />
      <View style={tw`h-full flex-shrink flex justify-center`}>
        <SocialsItem onPress={goToTwitter} title="twitter" />
        <SocialsItem onPress={goToInstagram} title="instagram" />
        <SocialsItem onPress={goToTelegram} title="telegram" />
        <SocialsItem onPress={goToDiscord} title="discord" />
      </View>
      <GoBackButton style={tw`flex items-center mt-16`} />
    </View>
  )
}
