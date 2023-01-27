import React from 'react'
import tw from '../../styles/tailwind'
import { Button, ButtonProps } from './Button'

export type WarningButtonProps = Partial<ButtonProps>

export const WarningButton = (props: WarningButtonProps) => {
  const { disabled } = props

  const color = disabled ? tw`bg-warning-mild` : tw`bg-warning-dark-2`
  const textColor = tw`text-primary-background-light`
  const borderColor = tw`border-warning-dark-2`

  return <Button {...{ ...props, color, textColor, borderColor }} />
}
