import { MSINAMONTH } from '../../../constants'

export const shouldShowBackupReminder = (
  lastFileBackupDate: number | undefined,
  lastSeedBackupDate: number | undefined,
) => {
  if (!lastFileBackupDate && !lastSeedBackupDate) return false
  const timeSinceLastFileBackup = Date.now() - (lastFileBackupDate || 0)
  const timeSinceLastSeedBackup = Date.now() - (lastSeedBackupDate || 0)
  const sinceMostRecentBackup = Math.min(timeSinceLastFileBackup, timeSinceLastSeedBackup)
  return sinceMostRecentBackup >= MSINAMONTH
}
