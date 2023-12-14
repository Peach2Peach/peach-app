import { View } from 'react-native'
import { Screen } from '../../../components/Screen'
import { OptionButton } from '../../../components/buttons/OptionButton'
import { DISCORD, INSTAGRAM, NOSTR, TELEGRAM, TWITCH, TWITTER, YOUTUBE } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { openURL } from '../../../utils/web/openURL'

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
    <View style={tw`items-center justify-center gap-2 grow`}>
      {socials.map(({ name, url }) => (
        <OptionButton key={name} onPress={() => openURL(url)}>
          {i18n(name)}
        </OptionButton>
      ))}
    </View>
  </Screen>
)
