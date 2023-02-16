import React, { ReactElement, useMemo } from 'react'
import { Linking, View } from 'react-native'

import tw from '../../../styles/tailwind'

import { OptionButton } from '../../../components'
import { useHeaderSetup } from '../../../hooks'
import i18n from '../../../utils/i18n'

const socials = [
  { name: 'twitter', url: 'https://twitter.com/peachbitcoin' },
  { name: 'instagram', url: 'https://www.instagram.com/peachbitcoin' },
  { name: 'telegram', url: 'https://t.me/+3KpdrMw25xBhNGJk' },
  { name: 'discord', url: 'https://discord.gg/skP9zqTB' },
  { name: 'twitch', url: 'https://www.twitch.tv/peachbitcoin' },
]
export default (): ReactElement => {
  useHeaderSetup(useMemo(() => ({ title: i18n('settings.socials.subtitle') }), []))

  return (
    <View style={tw`items-center justify-center flex-1`}>
      {socials.map(({ name, url }) => (
        <OptionButton key={name} onPress={() => Linking.openURL(url)} style={tw`mt-2`} wide>
          {i18n(name)}
        </OptionButton>
      ))}
    </View>
  )
}
