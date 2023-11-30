import { View } from 'react-native'

import { Icon, Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

export const KeepPhraseSecure = () => (
  <View style={tw`items-center`}>
    <Text style={tw`self-center h6`}>{i18n('settings.backups.seedPhrase.keepSecure')}</Text>
    <View style={tw`flex-row items-center mt-6`}>
      <Icon id="unlock" color={tw.color('black-2')} style={tw`w-12 h-12`} />
      <Text style={tw`pl-4 shrink`}>{i18n('settings.backups.seedPhrase.storeSafely')}</Text>
    </View>
  </View>
)
