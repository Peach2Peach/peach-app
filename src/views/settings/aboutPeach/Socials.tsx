import { ReactElement, useMemo } from 'react';
import { Linking, View } from 'react-native'

import tw from '../../../styles/tailwind'

import { OptionButton } from '../../../components'
import { useHeaderSetup } from '../../../hooks'
import i18n from '../../../utils/i18n'
import { DISCORD, INSTAGRAM, TELEGRAM, TWITCH, TWITTER } from '../../../constants'

const socials = [
  { name: 'twitter', url: TWITTER },
  { name: 'instagram', url: INSTAGRAM },
  { name: 'telegram', url: TELEGRAM },
  { name: 'discord', url: DISCORD },
  { name: 'twitch', url: TWITCH },
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
