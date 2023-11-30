import { View } from 'react-native'

import { Icon, Screen, Text } from '../../../../components'
import { Button } from '../../../../components/buttons/Button'
import { useNavigation } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

export const BackupCreated = () => {
  const navigation = useNavigation()
  const goToFileBackup = () => navigation.navigate('backups')
  return (
    <Screen gradientBackground>
      <View style={tw`items-center justify-center grow`}>
        <Text style={tw`h4 text-primary-background-light`}>{i18n('settings.backups.fileBackup.created')}</Text>
        <Text style={tw`body-l text-primary-background-light`}>{i18n('settings.backups.fileBackup.safeNow')}</Text>
        <Icon id="save" style={tw`w-32 h-32 mt-17`} color={tw.color('primary-background-light')} />
      </View>
      <Button
        style={tw`self-center bg-primary-background-light`}
        textColor={tw`text-primary-main`}
        onPress={goToFileBackup}
      >
        {i18n('back')}
      </Button>
    </Screen>
  )
}
