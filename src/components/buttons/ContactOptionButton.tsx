import React from 'react'
import tw from '../../styles/tailwind'
import { Button, ButtonProps } from './Button'

export const ContactOptionButton = (props: ButtonProps) => (
  <Button {...props} borderColor={tw`border-black-2`} textColor={tw`text-black-2`} wide />
)
