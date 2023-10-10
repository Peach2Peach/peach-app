import { View } from 'react-native'
import { Icon, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { MenuItem } from './components/MenuItem'
import { useUserExistsForDeviceSetup } from './hooks/useUserExistsForDeviceSetup'

export const UserExistsForDevice = () => {
  const { goToRestoreFromFile, goToRestoreFromSeed, goToRestoreReputation } = useUserExistsForDeviceSetup()

  return (
    <View style={tw`justify-center h-full`}>
      <View style={tw`items-center justify-center`}>
        <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('newUser.accountNotCreated')}</Text>
        <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('newUser.youAlreadyHaveOne')}</Text>
        <Icon id="userX" style={tw`w-32 h-32 mt-16`} color={tw`text-primary-background-light`.color} />
      </View>
      <View style={tw`items-center gap-8 mt-16 `}>
        <MenuItem onPress={goToRestoreFromFile}>{i18n('restoreBackup.restoreFromFile')}</MenuItem>
        <MenuItem onPress={goToRestoreFromSeed}>{i18n('restoreBackup.restoreFromSeed')}</MenuItem>
        <MenuItem onPress={goToRestoreReputation}>{i18n('restoreBackup.IdontHave')}</MenuItem>
      </View>
    </View>
  )
}
