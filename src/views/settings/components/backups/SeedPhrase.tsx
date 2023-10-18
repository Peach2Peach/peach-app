import { View } from 'react-native'

import { PeachScrollView } from '../../../../components'
import { Button } from '../../../../components/buttons/Button'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { useSeedBackupSetup } from '../../hooks/useSeedBackupSetup'
import { KeepPhraseSecure } from './KeepPhraseSecure'
import { LastSeedBackup } from './LastSeedBackup'
import { ReadAndUnderstood } from './ReadAndUnderstood'
import { SecurityInfo } from './SecurityInfo'
import { TwelveWords } from './TwelveWords'

export const screens = [
  { id: 'lastSeedBackup', view: LastSeedBackup },
  { id: 'securityInfo', view: SecurityInfo },
  { id: 'twelveWords', view: TwelveWords },
  { id: 'keepPhraseSecure', view: KeepPhraseSecure, buttonText: 'finish' },
]

export const SeedPhrase = ({ style }: ComponentProps) => {
  const { checked, toggleChecked, showNextScreen, currentScreenIndex, goBackToStart } = useSeedBackupSetup()

  const CurrentView = screens[currentScreenIndex].view

  return (
    <View style={[tw`h-full`, style]}>
      <PeachScrollView contentContainerStyle={tw`justify-center grow`}>
        {<CurrentView {...{ goBackToStart }} />}
      </PeachScrollView>
      <View>
        {currentScreenIndex === 1 && (
          <ReadAndUnderstood style={tw`self-center mb-10`} checkBoxProps={{ checked, onPress: toggleChecked }} />
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
