import { View } from 'react-native'
import { Icon, Text } from '../../components'

import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const RestoreSuccess = () => (
  <View style={tw`items-center justify-center h-full`}>
    <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('restoreBackup.backupRestored')}</Text>
    <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('restoreBackup.welcomeBack')}</Text>
    <Icon id="save" style={tw`w-32 h-32 mt-16`} color={tw`text-primary-background-light`.color} />
  </View>
)
