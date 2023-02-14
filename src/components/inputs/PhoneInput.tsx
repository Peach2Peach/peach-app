import React, { ReactElement } from 'react'
import { enforcePhonePattern } from '../../utils/format'
import Input, { InputProps } from './Input'

export const PhoneInput = ({ onChange, onSubmit, ...props }: InputProps): ReactElement => (
  <Input
    {...{
      ...props,
      onChange: onChange
        ? (number: string) => {
          onChange(enforcePhonePattern(number))
        }
        : undefined,
      onSubmit: onSubmit
        ? (number: string) => {
          onSubmit(enforcePhonePattern(number))
        }
        : undefined,
    }}
  />
)
