import { View } from 'react-native'
import { Icon, Screen, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useNavigation, useRoute } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const BackupTime = () => {
  const navigation = useNavigation()
  const route = useRoute<'backupTime'>()
  const { nextScreen, ...params } = route.params
  const goToBackups = () => navigation.replace('backups')
  const skip = () => (nextScreen ? navigation.replace(nextScreen, params) : navigation.replace('buy'))

  return (
    <Screen gradientBackground>
      <View style={tw`items-center justify-between grow`}>
        <View style={tw`justify-center gap-8 grow`}>
          <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('backupTime.title')}</Text>
          <View style={tw`flex-row items-center justify-center gap-6`}>
            <Icon id="saveCircleInverted" size={64} color={tw`text-primary-background-light`.color} />
            <Text style={tw`shrink body-l text-primary-background-light`}>
              {i18n('backupTime.description.mandatory')}
            </Text>
          </View>
        </View>
        <View style={tw`items-stretch gap-3`}>
          <Button style={tw`bg-primary-background-light`} textColor={tw`text-primary-main`} onPress={goToBackups}>
            {i18n('backupTime.makeABackup')}
          </Button>
          <Button ghost onPress={skip}>
            {i18n('backupTime.skipForNow')}
          </Button>
        </View>
      </View>
    </Screen>
  )
}
