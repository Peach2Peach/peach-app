import React, { ReactElement } from 'react'
import { Pressable } from 'react-native'
import { Fade, Icon, PrimaryButton } from '../../../components'
import { useKeyboard } from '../../../hooks/useKeyboard'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type NavigationProps = {
  back: () => void
  next: () => void
  stepValid: boolean
}

export const Navigation = ({ back, next, stepValid }: NavigationProps): ReactElement => {
  const keyboardOpen = useKeyboard()

  return (
    <Fade show={!keyboardOpen} style={tw`w-full flex items-center`} displayNone={false}>
      <Pressable testID="navigation-back" style={tw`absolute left-0 z-10`} onPress={back}>
        <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
      </Pressable>
      <PrimaryButton testID="navigation-next" disabled={!stepValid} onPress={next}>
        {i18n('next')}
      </PrimaryButton>
    </Fade>
  )
}

export default Navigation
