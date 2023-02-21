import React from 'react'
import tw from '../../styles/tailwind'
import { Button, ButtonProps } from './Button'

export type WarningButtonProps = Partial<ButtonProps>

export const WarningButton = (props: WarningButtonProps) => {
  const { disabled } = props

  const color = disabled ? tw`bg-black-4` : tw`bg-warning-main`
  const textColor = tw`text-primary-background-light`
  const borderColor = disabled ? tw`border-black-4` : tw`border-warning-main`

  return <Button {...{ ...props, color, textColor, borderColor }} />
}
