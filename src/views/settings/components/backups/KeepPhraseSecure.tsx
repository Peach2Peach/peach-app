import { View } from 'react-native'

import { Icon, Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

export const KeepPhraseSecure = () => (
  <View style={tw`px-6`}>
    <Text style={tw`self-center h6`}>{i18n('settings.backups.seedPhrase.keepSecure')}</Text>
    <View style={tw`flex-row items-center mt-6`}>
      <Icon id="unlock" color={tw`text-black-2`.color} style={tw`w-12 h-12`} />
      <Text style={tw`flex-shrink pl-4 body-m`}>{i18n('settings.backups.seedPhrase.storeSafely')}</Text>
    </View>
  </View>
)
