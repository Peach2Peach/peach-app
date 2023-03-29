import { View } from 'react-native'

import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const YourPassword = () => (
  <>
    <Text>{i18n('settings.backups.fileBackup.popup2.content.1')}</Text>

    <Text style={tw`mt-3`}>{i18n('settings.backups.fileBackup.popup2.content.2')}</Text>

    <View style={tw`pl-1 my-3`}>
      <Text>{i18n('settings.backups.fileBackup.popup2.content.3')}</Text>
      <Text>{i18n('settings.backups.fileBackup.popup2.content.4')}</Text>
      <Text>{i18n('settings.backups.fileBackup.popup2.content.5')}</Text>
    </View>

    <Text style={tw`font-bold`}>{i18n('settings.backups.fileBackup.popup2.content.6')}</Text>
  </>
)
