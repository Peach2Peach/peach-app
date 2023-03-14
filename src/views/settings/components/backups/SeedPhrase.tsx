import React, { ReactElement } from 'react'
import { View } from 'react-native'

import { PeachScrollView } from '../../../../components'
import { PrimaryButton } from '../../../../components/buttons'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { screens, useSeedBackupSetup } from '../../hooks/useSeedBackupSetup'
import { ReadAndUnderstood } from './ReadAndUnderstood'

export default ({ style }: ComponentProps): ReactElement => {
  const {
    checked,
    onPress,
    showNextScreen,
    currentScreenIndex,
    goBackToStart,
  } = useSeedBackupSetup()

  const CurrentView = screens[currentScreenIndex].view

  return (
    <View style={[tw`h-full`, style]}>
      <PeachScrollView style={tw`mr-10 ml-13`}>
        <CurrentView {...{ goBackToStart }} />
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
