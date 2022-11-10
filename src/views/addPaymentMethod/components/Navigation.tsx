import React, { ReactElement } from 'react'
import { Pressable } from 'react-native'
import { Button, Fade, Icon } from '../../../components'
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
      <Button
        testID="navigation-next"
        disabled={!stepValid}
        wide={false}
        onPress={stepValid ? next : () => {}}
        title={i18n('next')}
      />
    </Fade>
  )
}

export default Navigation
