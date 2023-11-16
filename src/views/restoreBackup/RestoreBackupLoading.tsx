import { View } from 'react-native'
import { Loading, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const RestoreBackupLoading = () => (
  <View style={tw`items-center justify-center h-full`}>
    <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('restoreBackup.restoringBackup')}</Text>
    <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('newUser.oneSec')}</Text>
    <Loading style={tw`w-32 h-32`} color={tw`text-primary-mild-1`.color} />
  </View>
)
