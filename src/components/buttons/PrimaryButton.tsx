import React from 'react'
import { ButtonProps, Button } from './Button'
import tw from '../../styles/tailwind'
import { ViewStyle, TextStyle, ImageStyle } from 'react-native'

export type PrimaryButtonProps = {
  white?: true
  border?: true
  baseColor?: ViewStyle & TextStyle & ImageStyle
} & Partial<ButtonProps>

export const PrimaryButton = (props: PrimaryButtonProps) => {
  const { white, border, disabled, baseColor } = props
  if (baseColor) {
    return <Button {...{ ...props, color: baseColor, textColor: baseColor, borderColor: baseColor }} />
  }
  const color
    = white && !border
      ? tw`bg-primary-background-light`
      : !border
        ? disabled
          ? tw`bg-primary-mild`
          : tw`bg-primary-light`
        : undefined
  const textColor = (!border && white) || (border && !white) ? tw`text-primary-light` : tw`text-primary-background-light`
  const borderColor = border ? (white ? tw`border-primary-background-light` : tw`border-primary-light`) : undefined

  return <Button {...{ ...props, color, textColor, borderColor }} />
}
