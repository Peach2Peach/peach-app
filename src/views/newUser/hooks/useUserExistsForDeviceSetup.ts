import { useNavigation, useRoute } from '../../../hooks'
import { useCreateAccountErrorHeader } from './useCreateAccountErrorHeader'

export const useUserExistsForDeviceSetup = () => {
  useCreateAccountErrorHeader()
  const route = useRoute<'newUser'>()
  const navigation = useNavigation()
  const goToRestoreFromFile = () => navigation.navigate('restoreBackup', { tab: 'fileBackup' })
  const goToRestoreFromSeed = () => navigation.navigate('restoreBackup', { tab: 'seedPhrase' })
  const goToRestoreReputation = () => navigation.navigate('restoreReputation', route.params)

  return { goToRestoreFromFile, goToRestoreFromSeed, goToRestoreReputation }
}
