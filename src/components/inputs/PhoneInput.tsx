import React, { ReactElement } from 'react'
import Input, { InputProps } from './Input'

const enforcePhonePattern = (number: string) =>
  number.length && !/^\+/gu.test(number) ? `+${number}` : number.replace(/[^0-9+]/gu, '')

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
