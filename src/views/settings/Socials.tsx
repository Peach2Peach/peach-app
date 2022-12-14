import React, { ReactElement, useContext, useMemo } from 'react'
import { Linking, View } from 'react-native'

import tw from '../../styles/tailwind'

import { GoBackButton, PrimaryButton } from '../../components'
import LanguageContext from '../../contexts/language'
import i18n from '../../utils/i18n'
import { useHeaderSetup } from '../../hooks'

export default (): ReactElement => {
  useContext(LanguageContext)

  const goToTwitter = () => Linking.openURL('https://twitter.com/peachbitcoin')
  const goToInstagram = () => Linking.openURL('https://www.instagram.com/peachbitcoin')
  const goToTelegram = () => Linking.openURL('https://t.me/+3KpdrMw25xBhNGJk')
  const goToDiscord = () => Linking.openURL('https://discord.gg/skP9zqTB')

  useHeaderSetup(useMemo(() => ({ title: i18n('settings.socials.subtitle') }), []))

  return (
    <View style={tw`h-full`}>
      <View style={tw`items-center justify-center flex-1`}>
        <PrimaryButton onPress={goToTwitter} style={tw`mt-2`} wide border baseColor={tw`text-black-2`}>
          {i18n('twitter')}
        </PrimaryButton>
        <PrimaryButton onPress={goToInstagram} style={tw`mt-2`} wide border baseColor={tw`text-black-2`}>
          {i18n('instagram')}
        </PrimaryButton>
        <PrimaryButton onPress={goToTelegram} style={tw`mt-2`} wide border baseColor={tw`text-black-2`}>
          {i18n('telegram')}
        </PrimaryButton>
        <PrimaryButton onPress={goToDiscord} style={tw`mt-2`} wide border baseColor={tw`text-black-2`}>
          {i18n('discord')}
        </PrimaryButton>
      </View>
      <GoBackButton style={tw`self-center mb-6`} />
    </View>
  )
}
