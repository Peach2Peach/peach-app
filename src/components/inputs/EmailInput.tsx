import React, { ReactElement } from 'react'
import { enforceEmailFormat } from '../../utils/format'
import Input, { InputProps } from './Input'

export const EmailInput = ({ onChange, onSubmit, ...props }: InputProps): ReactElement => (
  <Input
    {...{
      ...props,
      keyboardType: 'email-address',
      autoCorrect: false,
      onChange,
      onEndEditing: onChange ? (email: string) => onChange(enforceEmailFormat(email)) : undefined,
      onSubmit: onSubmit ? (email: string) => onSubmit(enforceEmailFormat(email)) : undefined,
    }}
  />
)
