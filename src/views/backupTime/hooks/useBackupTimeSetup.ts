import { useNavigation, useRoute } from '../../../hooks'

export const useBackupTimeSetup = () => {
  const navigation = useNavigation()
  const route = useRoute<'backupTime'>()
  const { nextScreen, ...params } = route.params
  const goToBackups = () => navigation.replace('backups')
  const skip = () => (nextScreen ? navigation.replace(nextScreen, params) : navigation.replace('buy'))

  return { goToBackups, skip }
}
