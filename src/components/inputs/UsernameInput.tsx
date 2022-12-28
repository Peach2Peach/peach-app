import React, { ReactElement } from 'react'
import Input, { InputProps } from './Input'

const enforceUsernamePattern = (usr: string) => {
  const cleaned = usr.toLowerCase().replace(/[^a-z0-9]/u, '')
  return cleaned.length ? `@${cleaned}` : cleaned
}

export const UsernameInput = ({ onChange, onSubmit, ...props }: InputProps): ReactElement => (
  <Input
    {...{
      ...props,
      onChange: onChange
        ? (usr: string) => {
          onChange(enforceUsernamePattern(usr))
        }
        : undefined,
      onSubmit: onSubmit
        ? (usr: string) => {
          onSubmit(enforceUsernamePattern(usr))
        }
        : undefined,
    }}
  />
)
