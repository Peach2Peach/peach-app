import { useCallback, useState } from 'react'
import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { PeachScrollView } from '../../../../components/PeachScrollView'
import { Button } from '../../../../components/buttons/Button'
import { Checkbox } from '../../../../components/inputs/Checkbox'
import { useToggleBoolean } from '../../../../hooks/useToggleBoolean'
import { useSettingsStore } from '../../../../store/settingsStore/useSettingsStore'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { KeepPhraseSecure } from './KeepPhraseSecure'
import { LastSeedBackup } from './LastSeedBackup'
import { SecurityInfo } from './SecurityInfo'
import { TwelveWords } from './TwelveWords'

export const screens = [
  { id: 'lastSeedBackup', view: LastSeedBackup },
  { id: 'securityInfo', view: SecurityInfo },
  { id: 'twelveWords', view: TwelveWords },
  { id: 'keepPhraseSecure', view: KeepPhraseSecure, buttonText: 'finish' },
]

export const SeedPhrase = () => {
  const [updateSeedBackupDate, lastSeedBackupDate] = useSettingsStore(
    (state) => [state.updateSeedBackupDate, state.lastSeedBackupDate],
    shallow,
  )

  const [checked, toggleChecked] = useToggleBoolean()
  const [currentScreenIndex, setCurrentScreenIndex] = useState(lastSeedBackupDate ? 0 : 1)
  const getCurrentScreen = useCallback(() => screens[currentScreenIndex], [currentScreenIndex])
  const showNextScreen = useCallback(() => {
    if (getCurrentScreen().id === 'keepPhraseSecure') {
      updateSeedBackupDate()
    }
    if (currentScreenIndex < screens.length - 1) {
      setCurrentScreenIndex((prev) => prev + 1)
    } else {
      setCurrentScreenIndex(0)
      toggleChecked()
    }
  }, [getCurrentScreen, currentScreenIndex, updateSeedBackupDate, toggleChecked])

  const goBackToStart = useCallback(() => {
    setCurrentScreenIndex(1)
  }, [])

  const CurrentView = screens[currentScreenIndex].view

  return (
    <View style={tw`flex-1`}>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`}>
        <CurrentView goBackToStart={goBackToStart} />
      </PeachScrollView>
      <View>
        {currentScreenIndex === 1 && (
          <Checkbox style={tw`self-center mb-10`} checked={checked} onPress={toggleChecked}>
            {i18n('settings.backups.seedPhrase.readAndUnderstood')}
          </Checkbox>
        )}
        {currentScreenIndex !== 0 && (
          <Button onPress={showNextScreen} style={tw`self-center`} disabled={!checked}>
            {i18n(screens[currentScreenIndex].buttonText || 'next')}
          </Button>
        )}
      </View>
    </View>
  )
}
