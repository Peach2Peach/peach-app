import React, { ReactElement } from 'react'
import { View } from 'react-native'

import tw from '../../../../styles/tailwind'

import { PeachScrollView } from '../../../../components'
import { PrimaryButton } from '../../../../components/buttons'
import { useHeaderSetup, useToggleBoolean } from '../../../../hooks'
import i18n from '../../../../utils/i18n'
import { KeepPhraseSecure } from './KeepPhraseSecure'
import { TwelveWords } from './TwelveWords'
import { ReadAndUnderstood } from './ReadAndUnderstood'
import { HelpIcon } from '../../../../components/icons'
import { useShowHelp } from '../../../../hooks/useShowHelp'

export default (): ReactElement => {
  const showSeedPhrasePopup = useShowHelp('seedPhrase')

  useHeaderSetup({
    title: i18n('settings.backups.walletBackup'),
    icons: [{ iconComponent: <HelpIcon />, onPress: showSeedPhrasePopup }],
  })
  const [checked, onPress] = useToggleBoolean()
  const [showsWords, toggle] = useToggleBoolean()

  return (
    <View style={tw`h-full`}>
      <PeachScrollView style={tw`mr-10 ml-13`}>{showsWords ? <TwelveWords /> : <KeepPhraseSecure />}</PeachScrollView>
      {!showsWords && <ReadAndUnderstood style={tw`self-center`} checkBoxProps={{ checked, onPress }} />}
      <PrimaryButton narrow onPress={toggle} style={tw`self-center mt-10 mb-6`} disabled={!checked}>
        {i18n('next')}
      </PrimaryButton>
    </View>
  )
}
