import React from 'react'
import tw from '../../styles/tailwind'
import { Button, ButtonProps } from './Button'

export type PrimaryButtonProps = {
  white?: true
  border?: true
} & Partial<ButtonProps>

export const PrimaryButton = (props: PrimaryButtonProps) => {
  const { white, border, disabled } = props

  const color = disabled
    ? tw`bg-primary-mild-1`
    : white && !border
      ? tw`bg-primary-background-light`
      : !border
        ? tw`bg-primary-main`
        : undefined
  const textColor = (!border && white) || (border && !white) ? tw`text-primary-main` : tw`text-primary-background-light`
  const borderColor = border ? (white ? tw`border-primary-background-light` : tw`border-primary-main`) : undefined

  return <Button {...{ ...props, color, textColor, borderColor }} />
}
