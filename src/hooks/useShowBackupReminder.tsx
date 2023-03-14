import { useSettingsStore } from '../store/settingsStore'
import { useShowWarning } from './useShowWarning'

export const useShowBackupReminder = () => {
  const showFirstBackupWarning = useShowWarning('firstBackup')
  const showPaymentBackupWarning = useShowWarning('paymentBackup')
  const lastFileBackupDate = useSettingsStore((state) => state.lastFileBackupDate)
  const lastSeedBackupDate = useSettingsStore((state) => state.lastSeedBackupDate)

  return !!lastFileBackupDate || !!lastSeedBackupDate ? showPaymentBackupWarning : showFirstBackupWarning
}
