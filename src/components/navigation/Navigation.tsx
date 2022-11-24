import React, { ReactElement } from 'react'
import { Pressable } from 'react-native'
import { Button } from '..'
import { useKeyboard } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Fade } from '../animation'
import Icon from '../Icon'

type NavigationProps = {
  screen: string
  back: () => void
  next: () => void
  stepValid: boolean
}

export const Navigation = ({ screen, back, next, stepValid }: NavigationProps): ReactElement => {
  const keyboardOpen = useKeyboard()
  let buttonText = i18n('next')

  if (/returnAddress/u.test(screen)) buttonText = i18n('lookForAMatch')

  return (
    <Fade show={!keyboardOpen} style={tw`w-full flex items-center`} displayNone={false}>
      {!/search/u.test(screen) ? (
        <Pressable testID="navigation-back" style={tw`absolute left-0 z-10`} onPress={back}>
          <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
        </Pressable>
      ) : null}
      <Button
        testID="navigation-next"
        disabled={!stepValid}
        wide={false}
        onPress={stepValid ? next : () => {}}
        title={buttonText}
      />
    </Fade>
  )
}

export default Navigation
