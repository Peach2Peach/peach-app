import { settingsStore } from '../../store/settingsStore'

export const checkBackupUpdate = () => {
  // @ts-expect-error
  const legacyBackup = settingsStore.getState().lastBackupDate
  if (!legacyBackup) return
  settingsStore.getState().setLastFileBackupDate(legacyBackup)
}
