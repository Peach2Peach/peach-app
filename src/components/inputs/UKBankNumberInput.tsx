import React, { ReactElement } from 'react'
import { enforceUKBankNumberFormat } from '../../utils/format'
import Input, { InputProps } from './Input'

export const UKBankNumberInput = ({ onChange, onSubmit, ...props }: InputProps): ReactElement => (
  <Input
    {...{
      ...props,
      onChange,
      onEndEditing: onChange ? (sortCode: string) => onChange(enforceUKBankNumberFormat(sortCode)) : undefined,
      onSubmit: onSubmit ? (sortCode: string) => onSubmit(enforceUKBankNumberFormat(sortCode)) : undefined,
    }}
  />
)
