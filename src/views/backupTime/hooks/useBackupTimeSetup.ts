import { useMemo } from 'react'
import { shallow } from 'zustand/shallow'
import { useNavigation, useRoute } from '../../../hooks'
import { useSettingsStore } from '../../../store/settingsStore'
import { isBackupMandatory } from '../../../utils/account'

export const useBackupTimeSetup = () => {
  const navigation = useNavigation()
  const route = useRoute<'backupTime'>()
  const { nextScreen, view, ...params } = route.params
  const [lastFileBackupDate, lastSeedBackupDate] = useSettingsStore(
    (state) => [state.lastFileBackupDate, state.lastSeedBackupDate],
    shallow,
  )

  const isMandatory = useMemo(
    () => !lastFileBackupDate && !lastSeedBackupDate && isBackupMandatory(),
    [lastFileBackupDate, lastSeedBackupDate],
  )
  const goToBackups = () => navigation.replace('backups')
  const skip = () => (nextScreen ? navigation.replace(nextScreen, params) : navigation.replace('home'))

  return { goToBackups, skip, view, isMandatory }
}
