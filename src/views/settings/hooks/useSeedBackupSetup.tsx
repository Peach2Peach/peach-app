import { useState, useCallback } from 'react';
import shallow from 'zustand/shallow'
import { HelpIcon } from '../../../components/icons'
import { useHeaderSetup, useToggleBoolean } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'
import { screens } from '../components/backups/SeedPhrase'

export const useSeedBackupSetup = () => {
  const showSeedPhrasePopup = useShowHelp('seedPhrase')

  const [setShowBackupReminder, setLastSeedBackupDate, lastSeedBackupDate] = useSettingsStore(
    (state) => [state.setShowBackupReminder, state.setLastSeedBackupDate, state.lastSeedBackupDate],
    shallow,
  )

  useHeaderSetup({
    title: i18n('settings.backups.walletBackup'),
    icons: [{ iconComponent: <HelpIcon />, onPress: showSeedPhrasePopup }],
  })
  const [checked, toggleChecked] = useToggleBoolean()
  const [currentScreenIndex, setCurrentScreenIndex] = useState(lastSeedBackupDate ? 0 : 1)
  const getCurrentScreen = () => screens[currentScreenIndex]
  const showNextScreen = useCallback(() => {
    if (getCurrentScreen().id === 'keepPhraseSecure') {
      setLastSeedBackupDate(Date.now())
      setShowBackupReminder(false)
    }
    if (currentScreenIndex < screens.length - 1) {
      setCurrentScreenIndex((prev) => prev + 1)
    } else {
      setCurrentScreenIndex(0)
      toggleChecked()
    }
  }, [currentScreenIndex, toggleChecked, setLastSeedBackupDate, setShowBackupReminder])

  const goBackToStart = useCallback(() => {
    setCurrentScreenIndex(1)
  }, [])

  return {
    checked,
    toggleChecked,
    showNextScreen,
    currentScreenIndex,
    getCurrentScreen,
    goBackToStart,
    lastSeedBackupDate,
  }
}
