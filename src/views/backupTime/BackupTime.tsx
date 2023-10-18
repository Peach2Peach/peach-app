import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Icon, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import i18n from '../../utils/i18n'
import { useBackupTimeSetup } from './hooks/useBackupTimeSetup'

export const BackupTime = () => {
  const { goToBackups, skip } = useBackupTimeSetup()

  return (
    <View style={tw`items-center justify-between h-full px-6 pb-7`}>
      <View style={tw`justify-center flex-shrink w-full h-full`}>
        <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('backupTime.title')}</Text>
        <View style={tw`flex-row items-center justify-center mt-8`}>
          <Icon id="saveCircleInverted" style={tw`w-16 h-16 mr-6`} color={tw`text-primary-background-light`.color} />
          <Text style={tw`max-w-[200px] body-l text-primary-background-light`}>
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
  )
}
