import { View } from 'react-native'
import { Icon, Text } from '../../components'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const RestoreSuccess = () => (
  <View style={tw`items-center justify-center gap-16 grow`}>
    <View>
      <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('restoreBackup.backupRestored')}</Text>
      <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('restoreBackup.welcomeBack')}</Text>
    </View>
    <Icon id="save" size={128} color={tw.color('primary-background-light')} />
  </View>
)
