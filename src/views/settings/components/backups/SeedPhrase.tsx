import React, { ReactElement, useCallback, useState } from 'react'
import { View } from 'react-native'

import tw from '../../../../styles/tailwind'

import { PeachScrollView } from '../../../../components'
import { PrimaryButton } from '../../../../components/buttons'
import { useHeaderSetup, useToggleBoolean } from '../../../../hooks'
import i18n from '../../../../utils/i18n'
import { SecurityInfo } from './SecurityInfo'
import { TwelveWords } from './TwelveWords'
import { ReadAndUnderstood } from './ReadAndUnderstood'
import { HelpIcon } from '../../../../components/icons'
import { useShowHelp } from '../../../../hooks/useShowHelp'
import { KeepPhraseSecure } from './KeepPhraseSecure'
import { LastSeedBackup } from './LastSeedBackup'

const screens = [
  {
    id: 'securityInfo',
    view: SecurityInfo,
  },
  {
    id: 'twelveWords',
    view: TwelveWords,
  },
  {
    id: 'keepPhraseSecure',
    view: KeepPhraseSecure,
    buttonText: 'finish',
  },
  {
    id: 'lastSeedBackup',
    view: LastSeedBackup,
  },
]

export default (): ReactElement => {
  const showSeedPhrasePopup = useShowHelp('seedPhrase')

  useHeaderSetup({
    title: i18n('settings.backups.walletBackup'),
    icons: [{ iconComponent: <HelpIcon />, onPress: showSeedPhrasePopup }],
  })
  const [checked, onPress] = useToggleBoolean()
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)
  const showNextScreen = useCallback(() => {
    if (currentScreenIndex < screens.length - 1) {
      setCurrentScreenIndex((prev) => prev + 1)
    }
  }, [currentScreenIndex])

  const CurrentView = screens[currentScreenIndex].view
  return (
    <View style={tw`h-full`}>
      <PeachScrollView style={tw`mr-10 ml-13`}>
        <CurrentView {...{ setCurrentScreenIndex }} />
      </PeachScrollView>
      {currentScreenIndex === 0 && <ReadAndUnderstood style={tw`self-center`} checkBoxProps={{ checked, onPress }} />}
      {currentScreenIndex !== screens.length - 1 && (
        <PrimaryButton narrow onPress={showNextScreen} style={tw`self-center mt-10 mb-6`} disabled={!checked}>
          {i18n(screens[currentScreenIndex].buttonText || 'next')}
        </PrimaryButton>
      )}
    </View>
  )
}
