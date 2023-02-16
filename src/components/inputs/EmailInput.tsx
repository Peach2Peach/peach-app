import React, { ReactElement } from 'react'
import Input, { InputProps } from './Input'

export const EmailInput = ({ onChange, onSubmit, ...props }: InputProps): ReactElement => (
  <Input
    {...{
      ...props,
      keyboardType: 'email-address',
      autoCorrect: false,
      onChange,
      onEndEditing: onChange ? (email: string) => onChange(email.toLowerCase()) : undefined,
      onSubmit: onSubmit ? (email: string) => onSubmit(email.toLowerCase()) : undefined,
    }}
  />
)
