import { View } from 'react-native'

import { Icon, PrimaryButton, Screen, Text } from '../../../../components'
import { useNavigation } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

export const BackupCreated = () => {
  const navigation = useNavigation()
  const goToFileBackup = () => navigation.navigate('backups')
  return (
    <Screen>
      <View style={tw`items-center justify-center grow`}>
        <Text style={tw`h4 text-primary-background-light`}>{i18n('settings.backups.fileBackup.created')}</Text>
        <Text style={tw`body-l text-primary-background-light`}>{i18n('settings.backups.fileBackup.safeNow')}</Text>
        <Icon id="save" style={tw`w-32 h-32 mt-17`} color={tw`text-primary-background-light`.color} />
      </View>
      <PrimaryButton white narrow style={tw`self-center`} onPress={goToFileBackup}>
        {i18n('back')}
      </PrimaryButton>
    </Screen>
  )
}
