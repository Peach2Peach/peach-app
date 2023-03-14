
import React, { useState, useCallback } from 'react'
import shallow from 'zustand/shallow'
import { HelpIcon } from '../../../components/icons'
import { useHeaderSetup, useToggleBoolean } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import { useSettingsStore } from '../../../store/settingsStore'
import i18n from '../../../utils/i18n'
import { KeepPhraseSecure } from '../components/backups/KeepPhraseSecure'
import { LastSeedBackup } from '../components/backups/LastSeedBackup'
import { SecurityInfo } from '../components/backups/SecurityInfo'
import { TwelveWords } from '../components/backups/TwelveWords'


export const screens = [
  { id: 'securityInfo', view: SecurityInfo },
  { id: 'twelveWords', view: TwelveWords },
  { id: 'keepPhraseSecure', view: KeepPhraseSecure, buttonText: 'finish' },
  { id: 'lastSeedBackup', view: LastSeedBackup },
]
export const useSeedBackupSetup = () => {
  const showSeedPhrasePopup = useShowHelp('seedPhrase')

  const [setShowBackupReminder, setLastSeedBackupDate] = useSettingsStore(
    (state) => [state.setShowBackupReminder, state.setLastSeedBackupDate],
    shallow,
  )

  useHeaderSetup({
    title: i18n('settings.backups.walletBackup'),
    icons: [{ iconComponent: <HelpIcon />, onPress: showSeedPhrasePopup }],
  })
  const [checked, onPress] = useToggleBoolean()
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)
  const showNextScreen = useCallback(() => {
    if (screens[currentScreenIndex].id === 'keepPhraseSecure') {
      setLastSeedBackupDate(Date.now())
      setShowBackupReminder(false)
    }
    if (currentScreenIndex < screens.length - 1) {
      setCurrentScreenIndex((prev) => prev + 1)
    }
  }, [currentScreenIndex, setLastSeedBackupDate, setShowBackupReminder])

  const goBackToStart = useCallback(() => {
    setCurrentScreenIndex(0)
    onPress()
  }, [onPress])

  return {
    checked,
    onPress,
    showNextScreen,
    currentScreenIndex,
    goBackToStart,
  }
}