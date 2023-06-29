import { shallow } from 'zustand/shallow'
import { useSettingsStore } from '../store/settingsStore'
import { shouldShowBackupReminder } from '../store/settingsStore/helpers/shouldShowBackupReminder'

export const useShowBackupReminder = () => {
  const [lastFileBackupDate, lastSeedBackupDate, showBackupReminder, setShowBackupReminder] = useSettingsStore(
    (state) => [
      state.lastFileBackupDate,
      state.lastSeedBackupDate,
      state.showBackupReminder,
      state.setShowBackupReminder,
    ],
    shallow,
  )

  if (!showBackupReminder && shouldShowBackupReminder(lastFileBackupDate, lastSeedBackupDate)) {
    setShowBackupReminder(true)
  }
}
