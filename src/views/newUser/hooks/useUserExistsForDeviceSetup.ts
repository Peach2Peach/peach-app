import { useNavigation } from '../../../hooks'
import { useCreateAccountErrorHeader } from './useCreateAccountErrorHeader'

export const useUserExistsForDeviceSetup = () => {
  useCreateAccountErrorHeader()
  const navigation = useNavigation()
  const goToRestoreFromFile = () => navigation.navigate('restoreBackup', { tab: 'fileBackup' })
  const goToRestoreFromSeed = () => navigation.navigate('restoreBackup', { tab: 'seedPhrase' })
  const goToRestoreReputation = () => navigation.navigate('restoreReputation')

  return { goToRestoreFromFile, goToRestoreFromSeed, goToRestoreReputation }
}
