import { View } from 'react-native'
import { Icon } from '../../../../components/Icon'
import { Screen } from '../../../../components/Screen'
import { Button } from '../../../../components/buttons/Button'
import { PeachText } from '../../../../components/text/PeachText'
import { useNavigation } from '../../../../hooks'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

export const BackupCreated = () => {
  const navigation = useNavigation()
  const goToFileBackup = () => navigation.navigate('backups')
  return (
    <Screen gradientBackground>
      <View style={tw`items-center justify-center grow`}>
        <PeachText style={tw`h4 text-primary-background-light`}>{i18n('settings.backups.fileBackup.created')}</PeachText>
        <PeachText style={tw`body-l text-primary-background-light`}>
          {i18n('settings.backups.fileBackup.safeNow')}
        </PeachText>
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
