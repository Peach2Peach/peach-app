import React from 'react'
import tw from '../../styles/tailwind'
import { Button, ButtonProps } from './Button'

type OptionButtonProps = Omit<ButtonProps, 'borderColor' | 'textColor'>

export const OptionButton = (props: OptionButtonProps) => (
  <Button {...props} borderColor={tw`border-black-2`} textColor={tw`text-black-2`} />
)
