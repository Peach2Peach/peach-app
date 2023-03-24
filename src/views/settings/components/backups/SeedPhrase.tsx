import React, { ReactElement } from 'react'
import { View } from 'react-native'
const { LinearGradient } = require('react-native-gradients')

import { PeachScrollView } from '../../../../components'
import { PrimaryButton } from '../../../../components/buttons'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { whiteGradient } from '../../../../utils/layout'
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

export default ({ style }: ComponentProps): ReactElement => {
  const { checked, toggleChecked, showNextScreen, currentScreenIndex, goBackToStart } = useSeedBackupSetup()

  const CurrentView = screens[currentScreenIndex].view

  return (
    <View style={[tw`h-full`, style]}>
      <PeachScrollView contentContainerStyle={tw`items-center justify-center flex-grow`}>
        {<CurrentView {...{ goBackToStart }} />}
      </PeachScrollView>
      <View>
        <View style={tw`w-full h-8 -mt-8`}>
          <LinearGradient colorList={whiteGradient} angle={90} />
        </View>
        {currentScreenIndex === 1 && (
          <ReadAndUnderstood style={tw`self-center mb-10`} checkBoxProps={{ checked, onPress: toggleChecked }} />
        )}
        {currentScreenIndex !== 0 && (
          <PrimaryButton narrow onPress={showNextScreen} style={tw`self-center mb-6`} disabled={!checked}>
            {i18n(screens[currentScreenIndex].buttonText || 'next')}
          </PrimaryButton>
        )}
      </View>
    </View>
  )
}
