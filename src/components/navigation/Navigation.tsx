import React, { ReactElement } from 'react'
import { View } from 'react-native'
import shallow from 'zustand/shallow'
import { PrimaryButton } from '..'
import { useKeyboard } from '../../hooks'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { whiteGradient } from '../../utils/layout'
import { Fade } from '../animation'

const { LinearGradient } = require('react-native-gradients')

type NavigationProps = {
  screen: string
  next: () => void
  stepValid: boolean
}

export const Navigation = ({ screen, next, stepValid }: NavigationProps): ReactElement => {
  const keyboardOpen = useKeyboard()
  const [peachWalletActive, payoutAddress, payoutAddressSignature] = useSettingsStore(
    (state) => [state.peachWalletActive, state.payoutAddress, state.payoutAddressSignature],
    shallow,
  )
  const canPublish = screen === 'summary' && (peachWalletActive || (payoutAddress && payoutAddressSignature))
  const buttonText = canPublish ? i18n('offer.publish') : i18n('next')

  return (
    <Fade
      show={!keyboardOpen}
      displayNone={false}
      style={tw`absolute bottom-0 items-center w-full pb-8 bg-primary-background-light`}
    >
      <View style={tw`w-full h-8 -mt-8`}>
        <LinearGradient colorList={whiteGradient} angle={90} />
      </View>
      <View style={tw`flex items-center w-full`}>
        <PrimaryButton
          testID="navigation-next"
          disabled={!stepValid}
          onPress={next}
          iconId={canPublish ? 'uploadCloud' : undefined}
        >
          {buttonText}
        </PrimaryButton>
      </View>
    </Fade>
  )
}

export default Navigation
