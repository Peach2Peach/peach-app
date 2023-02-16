import React, { ReactElement } from 'react'
import { enforceUsernameFormat } from '../../utils/format'
import Input, { InputProps } from './Input'

export const UsernameInput = ({ onChange, onSubmit, ...props }: InputProps): ReactElement => (
  <Input
    {...{
      ...props,
      onChange,
      onEndEditing: onChange ? (usr: string) => onChange(enforceUsernameFormat(usr)) : undefined,
      onSubmit: onSubmit ? (usr: string) => onSubmit(enforceUsernameFormat(usr)) : undefined,
    }}
  />
)
