import { useMemo } from 'react'
import { useNavigation, useRoute } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { isBackupMandatory } from '../../../utils/account'

export const useBackupTimeSetup = () => {
  const navigation = useNavigation()
  const route = useRoute<'backupTime'>()
  const { nextScreen, view, ...params } = route.params
  const lastBackupDate = useSettingsStore((state) => state.lastBackupDate)

  const isMandatory = useMemo(() => !lastBackupDate && isBackupMandatory(), [lastBackupDate])
  const goToBackups = () => navigation.replace('backups')
  const skip = () => (nextScreen ? navigation.replace(nextScreen, params) : navigation.replace('home'))

  return { goToBackups, skip, view, isMandatory }
}
