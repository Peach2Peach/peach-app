import { Linking, View } from 'react-native'

import tw from '../../../styles/tailwind'

import { OptionButton, Screen } from '../../../components'
import { DISCORD, INSTAGRAM, NOSTR, TELEGRAM, TWITCH, TWITTER, YOUTUBE } from '../../../constants'
import i18n from '../../../utils/i18n'

const socials = [
  { name: 'twitter', url: TWITTER },
  { name: 'instagram', url: INSTAGRAM },
  { name: 'telegram', url: TELEGRAM },
  { name: 'discord', url: DISCORD },
  { name: 'twitch', url: TWITCH },
  { name: 'youtube', url: YOUTUBE },
  { name: 'nostr', url: NOSTR },
]

export const Socials = () => (
  <Screen header={i18n('settings.socials.subtitle')}>
    <View style={tw`items-center justify-center grow`}>
      {socials.map(({ name, url }) => (
        <OptionButton key={name} onPress={() => Linking.openURL(url)} style={tw`mt-2`} wide>
          {i18n(name)}
        </OptionButton>
      ))}
    </View>
  </Screen>
)
