import { View } from 'react-native'
import { Icon, Text } from '../../components'
import { useNavigation } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { MenuItem } from './components/MenuItem'
import { useCreateAccountErrorHeader } from './hooks/useCreateAccountErrorHeader'

type Props = {
  iDontHaveABackup: () => void
}
export const UserExistsForDevice = ({ iDontHaveABackup }: Props) => {
  useCreateAccountErrorHeader()
  const navigation = useNavigation()
  const goToRestoreFromFile = () => navigation.navigate('restoreBackup', { tab: 'fileBackup' })
  const goToRestoreFromSeed = () => navigation.navigate('restoreBackup', { tab: 'seedPhrase' })
  const goToRestoreReputation = () => navigation.navigate('restoreReputation')

  return (
    <View style={tw`flex justify-center h-full`}>
      <View style={tw`flex items-center justify-center`}>
        <Text style={tw`text-center h4 text-primary-background-light`}>{i18n('newUser.accountNotCreated')}</Text>
        <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('newUser.youAlreadyHaveOne')}</Text>
        <Icon id="userX" style={tw`w-32 h-32 mt-16`} color={tw`text-primary-background-light`.color} />
      </View>
      <View style={tw`mt-16 items-center gap-8 `}>
        <MenuItem onPress={goToRestoreFromFile}>{i18n('restoreBackup.restoreFromFile')}</MenuItem>
        <MenuItem onPress={goToRestoreFromSeed}>{i18n('restoreBackup.restoreFromSeed')}</MenuItem>
        <MenuItem onPress={goToRestoreReputation}>{i18n('restoreBackup.IdontHave')}</MenuItem>
      </View>
    </View>
  )
}
