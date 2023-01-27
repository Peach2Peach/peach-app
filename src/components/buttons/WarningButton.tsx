import React from 'react'
import tw from '../../styles/tailwind'
import { Button, ButtonProps } from './Button'

export type WarningButtonProps = Partial<ButtonProps>

export const WarningButton = (props: WarningButtonProps) => {
  const { disabled } = props

  const color = disabled ? tw`bg-warning-mild` : tw`bg-warning-main`
  const textColor = tw`text-primary-background-light`
  const borderColor = tw`border-warning-main`

  return <Button {...{ ...props, color, textColor, borderColor }} />
}
