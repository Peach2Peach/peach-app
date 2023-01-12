import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PrimaryButton } from '..'
import { useKeyboard } from '../../hooks'
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
  let buttonText = i18n('next')

  if (/returnAddress/u.test(screen)) buttonText = i18n('lookForAMatch')

  return (
    <View style={tw`absolute bottom-0 items-center w-full pb-8 bg-primary-background-light`}>
      <View style={tw`w-full h-8 -mt-8`}>
        <LinearGradient colorList={whiteGradient} angle={90} />
      </View>
      <Fade show={!keyboardOpen} style={tw`flex items-center w-full`} displayNone={false}>
        <PrimaryButton testID="navigation-next" disabled={!stepValid} onPress={next} narrow>
          {buttonText}
        </PrimaryButton>
      </Fade>
    </View>
  )
}

export default Navigation
