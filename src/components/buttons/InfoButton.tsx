import React from 'react'
import tw from '../../styles/tailwind'
import { ButtonProps, Button } from './Button'

type InfoButtonProps = { white?: true; border?: true } & Partial<ButtonProps>

export const InfoButton = (props: InfoButtonProps) => {
  const { white, border } = props
  const color = border ? undefined : white ? tw`bg-primary-background-light` : tw`bg-info-light`
  const textColor = border || white ? tw`text-info-light` : tw`text-primary-background-light`
  const borderColor = border ? tw`border-info-light` : undefined

  return <Button {...{ ...props, color, textColor, borderColor }} />
}
