import React, { ReactElement } from 'react'
import { enforceBICFormat } from '../../utils/format'
import Input, { InputProps } from './Input'

export const BICInput = ({ onChange, onSubmit, ...props }: InputProps): ReactElement => (
  <Input
    {...{
      ...props,
      onChange,
      onEndEditing: onChange ? (bic: string) => onChange(enforceBICFormat(bic)) : undefined,
      onSubmit: onSubmit ? (bic: string) => onSubmit(enforceBICFormat(bic)) : undefined,
    }}
  />
)
